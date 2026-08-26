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

export function prepareSetQueues(parameters: SetQueuesParameters) {
  return {
    address: parameters.queueStrategyEngine,
    abi: queueStrategyEngineAbi,
    functionName: 'setQueues',
    args: [parameters.depositQueue, parameters.redeemQueue],
  } as const
}

/**
 * Configures the deposit and redeem allocation queues on a multi-vehicle's QueueStrategyEngine. Each queue entry maps a vehicle to a target allocation and threshold.
 *
 * @param parameters - {@link SetQueuesParameters}
 *
 * @example
 * import { setQueues } from '@railnetorg/railnet-sdk'
 *
 * const hash = await setQueues(walletClient, {
 *   queueStrategyEngine: contracts.queueStrategyEngine,
 *   depositQueue: [{ vehicle: vehicleAddress, target: { value: 5_000n * 10n ** 18n, threshold: 0n } }],
 *   redeemQueue: [{ vehicle: vehicleAddress, target: { value: 0n, threshold: 0n } }],
 *   account: account.address,
 * })
 */
export async function setQueues(
  client: Client,
  parameters: SetQueuesParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSetQueues(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
