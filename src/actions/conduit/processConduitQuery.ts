import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Query } from '../../types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: Query
}

/**
 * Builds the `conduit.process()` call, which advances a query's state. Async vehicles need it.
 *
 * The query's receiver may always call it, with no role; any other caller needs CONDUIT_PROCESS,
 * which is what a keeper driving settlement holds. A query already in a terminal state returns that
 * state without advancing, and one this conduit never created reverts `UnknownQuery`.
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
