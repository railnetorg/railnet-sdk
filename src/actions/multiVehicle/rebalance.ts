import { type Address, encodeFunctionData, type Hex, maxUint256 } from 'viem'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import { SECTOR_ALLOCATION, SECTOR_AVAILABLE, vehicleSector } from '../../constants/sectors.js'
import { QueryMode } from '../../types.js'

export type RebalanceLegOneParameters = {
  sectorAccountingEngine: Address
  /** Sub-vehicle the position leaves. */
  from: Address
  /** Sub-vehicle the position lands in. */
  to: Address
  /** Shares of `from` to move, in that vehicle's share units (18 decimals). */
  shares: bigint
  /** Threaded through both legs so indexers stitch the Moved/Dispatched events into one rebalance. */
  operationId: Hex
}

/**
 * First leg of a rebalance, as a single `multicall`: stage the shares out of ALLOCATION into the
 * source vehicle's sector, then dispatch a redeem.
 *
 * Batched deliberately. Run as two transactions, an abandoned sequence would leave the shares
 * stranded in the source's staging sector with no position earning on them.
 *
 * `settledDestination` is the destination vehicle's sector rather than AVAILABLE, so the proceeds
 * never sit anywhere the queue-strategy engine could re-allocate them mid-rebalance.
 * `rejectedDestination` is ALLOCATION, where the shares came from.
 *
 * @param parameters - {@link RebalanceLegOneParameters}
 */
export function buildRebalanceLegOneCall(parameters: RebalanceLegOneParameters) {
  const sourceSector = vehicleSector(parameters.from)
  const targetSector = vehicleSector(parameters.to)

  const move = encodeFunctionData({
    abi: sectorAccountingEngineAbi,
    functionName: 'move',
    args: [
      {
        from: SECTOR_ALLOCATION,
        to: sourceSector,
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
        settledDestination: targetSector,
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

export type RebalanceLegTwoParameters = {
  sectorAccountingEngine: Address
  /** Sub-vehicle the staged proceeds are deposited into. */
  to: Address
  /** The same id leg one used. */
  operationId: Hex
}

/**
 * Second leg: deposit whatever leg one's redeem left staged at the destination.
 *
 * Separate on purpose — an asynchronous source redeem only reaches the destination's sector once its
 * query settles, so this cannot be batched with leg one. Poll the query state rather than sending
 * blind retries. The uint256 sentinel consumes the whole staged balance, so the redeemed amount
 * never has to be computed off-chain.
 *
 * @param parameters - {@link RebalanceLegTwoParameters}
 */
export function buildRebalanceLegTwoCall(parameters: RebalanceLegTwoParameters) {
  return {
    address: parameters.sectorAccountingEngine,
    abi: sectorAccountingEngineAbi,
    functionName: 'dispatch',
    args: [
      {
        vehicle: parameters.to,
        mode: QueryMode.DEPOSIT,
        amount: maxUint256,
        settledDestination: SECTOR_ALLOCATION,
        rejectedDestination: SECTOR_AVAILABLE,
        minOutput: 0n,
        data: '0x',
        operationId: parameters.operationId,
      },
    ],
  } as const
}
