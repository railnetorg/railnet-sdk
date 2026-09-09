import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Query } from '../../types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: Query
}

/**
 * Builds the `conduit.process()` call, which advances a query's state. Async vehicles need it; in
 * a deployment where a keeper drives settlement, this is its call, not an integration's.
 *
 * @param parameters - {@link ProcessConduitQueryParameters}
 */
export function buildProcessConduitQueryCall(parameters: ProcessConduitQueryParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [parameters.query],
  } as const
}
