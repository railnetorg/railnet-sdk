import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { queueStrategyEngineAbi } from '../../abi/queueStrategyEngine.js'
import type { ContractCallOptions } from '../../types.js'

export type QueueTarget = {
  value: bigint
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
 * Configures the deposit and redeem allocation queues on a multi-vehicle's QueueStrategyEngine. Each queue entry maps a vehicle to a target allocation and threshold.
 * @param client - Viem client instance
 * @param parameters - QueueStrategyEngine address, deposit queue entries, and redeem queue entries
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function setQueues(
  client: Client,
  parameters: SetQueuesParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
    account: parameters.account,
  })

  return writeContract(client, request)
}
