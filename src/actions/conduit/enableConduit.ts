import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'

export type EnableConduitParameters = {
  conduit: Address
}

export function prepareEnableConduit(parameters: EnableConduitParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
  } as const
}

/**
 * Enables a conduit, transitioning it to an operational state. Can only be called by the conduit factory.
 * @param client - Viem client instance
 * @param parameters - The conduit address and caller account
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function enableConduit(
  client: Client,
  parameters: EnableConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareEnableConduit(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
