import { type Address, encodeFunctionData, type Hex } from 'viem'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import { SECTOR_ALLOCATION, vehicleSector } from '../../constants/sectors.js'
import { QueryMode } from '../../types.js'

export type RebalanceRedeemParameters = {
  sectorAccountingEngine: Address
  /** Sub-vehicle the position leaves. */
  from: Address
  /**
   * Sub-vehicle the proceeds are staged for. Its sector receives them; nothing is deposited yet.
   * It must be authorized, since a redeem's settled destination goes through the engine's
   * asset-sector check, which rejects an unauthorized vehicle sector with `InvalidVehicleSector`.
   */
  to: Address
  /** Shares of `from` to move, in that vehicle's share units (18 decimals). */
  shares: bigint
  /** Floor on the assets the redeem must produce. Defaults to none. */
  minOutput?: bigint
  /** Echoed in the `Moved` and `Dispatched` events, so an indexer can stitch both halves together. */
  operationId: Hex
}

/**
 * Redeems a position out of one sub-vehicle and stages the proceeds in another's sector, as one
 * `multicall` of a move and a dispatch. Needs MULTI_VEHICLE_MOVE and MULTI_VEHICLE_DISPATCH. The
 * proceeds settle into `to`'s sector, out of the queue strategy engine's reach, and an async
 * source settles only once its query progresses; the deposit into `to` is a second transaction.
 * Redeems exactly `shares`; a request above what the sector holds reverts
 * `DispatchRedeemAmountTooHigh`.
 *
 * @param parameters - {@link RebalanceRedeemParameters}
 */
export function buildRebalanceRedeemCall(parameters: RebalanceRedeemParameters) {
  const move = encodeFunctionData({
    abi: sectorAccountingEngineAbi,
    functionName: 'move',
    args: [
      {
        from: SECTOR_ALLOCATION,
        to: vehicleSector(parameters.from),
        // Moving the sub-vehicle's own shares, so the "asset" is that vehicle.
        asset: parameters.from,
        amount: parameters.shares,
        operationId: parameters.operationId,
      },
    ],
  })

  const redeem = encodeFunctionData({
    abi: sectorAccountingEngineAbi,
    functionName: 'dispatch',
    args: [
      {
        vehicle: parameters.from,
        mode: QueryMode.REDEEM,
        // Pinned, not the maxUint256 sentinel: that resolves to the whole sector balance, and a
        // pinned amount is what lets minOutput bind (MinOutputRequiresPinnedAmount otherwise).
        amount: parameters.shares,
        settledDestination: vehicleSector(parameters.to),
        rejectedDestination: SECTOR_ALLOCATION,
        minOutput: parameters.minOutput ?? 0n,
        data: '0x',
        operationId: parameters.operationId,
      },
    ],
  })

  return {
    address: parameters.sectorAccountingEngine,
    abi: sectorAccountingEngineAbi,
    functionName: 'multicall',
    args: [[move, redeem]],
  } as const
}
