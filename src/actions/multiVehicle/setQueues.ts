import type { Address } from 'viem'
import { queueStrategyEngineAbi } from '../../abi/queueStrategyEngine.js'

export type QueueTarget = {
  /**
   * Allocation target in the sub-vehicle's share units. `2n ** 256n - 1n` (unlimited) is accepted on
   * the deposit queue only: an unlimited `value + threshold` on a redeem entry is rejected.
   */
  value: bigint
  /** Tolerance margin, same units. Must not exceed `value` on a finite target. */
  threshold: bigint
}

export type QueueEntry = {
  vehicle: Address
  target: QueueTarget
}

export type SetQueuesParameters = {
  queueStrategyEngine: Address
  depositQueue: QueueEntry[]
  redeemQueue: QueueEntry[]
}

/**
 * Configures the deposit and redeem allocation queues on a multi-vehicle's QueueStrategyEngine.
 * Each queue entry maps a vehicle to a target allocation and threshold. The caller needs
 * MULTI_VEHICLE_SET_QUEUES scoped to the engine.
 *
 * Every entry is validated on chain and rejected with `InvalidQueueEntry(index, vehicle, reason)`,
 * whose `reason` names the failing check. Both queues require a ready vehicle whose asset matches
 * the engine's, in a mode other than `Manual`. A deposit entry additionally requires the vehicle to
 * be authorized and its `value` to be non-zero; a redeem entry requires a single-asset vehicle and
 * a finite target. A finite target carrying `threshold > value` reverts `InvalidTarget`.
 *
 * @param parameters - {@link SetQueuesParameters}
 */
export function buildSetQueuesCall(parameters: SetQueuesParameters) {
  return {
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
  } as const
}
