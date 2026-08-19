import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'
import type { Asset, ConduitMode } from './types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: {
    owner: Address
    receiver: Address
    input: Asset[]
    output: Asset[]
    mode: ConduitMode
    salt: Hex
    data: Hex
  }
}

export function prepareProcessConduitQuery(parameters: ProcessConduitQueryParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [parameters.query],
  } as const
}

/**
 * Processes a query on a conduit by calling `conduit.process()`, advancing its state. Used for async (STEAM) vehicles where queries go through multiple state transitions.
 * @param client - Viem client instance
 * @param parameters - Conduit address and the full Query struct (owner, receiver, input Asset[], output Asset[], mode, salt, data)
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function processConduitQuery(
  client: Client,
  parameters: ProcessConduitQueryParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareProcessConduitQuery(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
