import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
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
  walletClient: WalletClient<Transport, Chain>,
  parameters: SetQueuesParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
