import type { Address } from 'viem'
import { queueStrategyEngineAbi } from '../../abi/queueStrategyEngine.js'

export type QueueTarget = {
  /**
   * Allocation target in the sub-vehicle's share units. `2n ** 256n - 1n` (unlimited) is accepted
   * on the deposit queue only; a redeem entry needs a finite `value + threshold`.
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
 * Configures the deposit and redeem allocation queues on a multi-vehicle's QueueStrategyEngine,
 * one target per sub-vehicle. Needs MULTI_VEHICLE_SET_QUEUES scoped to the engine; a bad entry
 * reverts `InvalidQueueEntry(index, vehicle, reason)`, and `threshold > value` on a finite target
 * reverts `InvalidTarget`.
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
