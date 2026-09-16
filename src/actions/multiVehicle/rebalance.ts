import { type Address, encodeFunctionData, type Hex, maxUint256 } from 'viem'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import { SECTOR_ALLOCATION, vehicleSector } from '../../constants/sectors.js'
import { QueryMode } from '../../types.js'

export type RebalanceRedeemParameters = {
  sectorAccountingEngine: Address
  /** Sub-vehicle the position leaves. */
  from: Address
  /** Sub-vehicle the proceeds are staged for. Its sector receives them; nothing is deposited yet. */
  to: Address
  /** Shares of `from` to move, in that vehicle's share units (18 decimals). */
  shares: bigint
  /** Echoed in the `Moved` and `Dispatched` events, so an indexer can stitch both halves together. */
  operationId: Hex
}

/**
 * Redeems a position out of one sub-vehicle and stages the proceeds in another's sector, as a
 * single `multicall` of a move and a dispatch. Needs MULTI_VEHICLE_MOVE and
 * MULTI_VEHICLE_DISPATCH.
 *
 * Batched because the two steps are not independent: sent separately and abandoned in between, the
 * shares sit in the source's staging sector, out of ALLOCATION and earning nothing.
 *
 * The proceeds settle into `to`'s sector rather than AVAILABLE, where the queue strategy engine
 * could re-allocate them before the rebalance finishes. Depositing them into `to` is a second
 * transaction, because an async source only settles once its query progresses: dispatch a DEPOSIT
 * of `maxUint256` from that sector, settling into ALLOCATION.
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
        // Consume whatever the move just staged. The sentinel cap-limits instead of reverting, and
        // requires minOutput to be 0 (MinOutputRequiresPinnedAmount otherwise).
        amount: maxUint256,
        settledDestination: vehicleSector(parameters.to),
        rejectedDestination: SECTOR_ALLOCATION,
        minOutput: 0n,
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
