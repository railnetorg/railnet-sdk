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
 * The sender must be the query's `receiver` — or, once an OwnerRegistry has wrapped the claim, the
 * holder of its ERC-721. Anyone else needs CONDUIT_PROCESS.
 *
 * A query already SETTLED or REJECTED returns that state without advancing or checking
 * authorization; one this conduit never created reverts `UnknownQuery`.
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
