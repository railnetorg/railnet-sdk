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
    input: Asset
    output: Asset
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
 *
 * @param parameters - {@link ProcessConduitQueryParameters}
 *
 * @example
 * import { ConduitMode, processConduitQuery } from '@railnetorg/railnet-sdk'
 *
 * // query.salt is not the salt passed to depositConduit: the conduit derives it as
 * // keccak256(abi.encode(depositor, sourceSalt))
 * const hash = await processConduitQuery(walletClient, {
 *   conduit: conduitAddress,
 *   query: {
 *     owner: conduitAddress,
 *     receiver: conduitAddress,
 *     input: { asset: usdc, value: 1_000_000n },
 *     output: { asset: vehicleAddress, value: 0n },
 *     mode: ConduitMode.DEPOSIT,
 *     salt: derivedQuerySalt,
 *     data: '0x',
 *   },
 *   account: account.address,
 * })
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
