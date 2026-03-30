import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { queueStrategyEngineAbi } from '../../abi/queueStrategyEngine.js'

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

export async function setQueues(
  client: Client,
  parameters: SetQueuesParameters & { account: Address },
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
    account: parameters.account,
  })

  return writeContract(client, request)
}
