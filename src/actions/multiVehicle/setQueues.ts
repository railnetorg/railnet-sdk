import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
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

export type SetQueuesReturnType = {
  transactionHash: Hash
}

export async function setQueues(
  walletClient: WalletClient<Transport, Chain>,
  parameters: SetQueuesParameters & { account: Address },
): Promise<SetQueuesReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Set queues transaction reverted')
  }

  return {
    transactionHash: hash,
  }
}
