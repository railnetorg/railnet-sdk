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
 * The authorized sender is whatever `_ownerOf` resolves to: the `receiver` the query was created
 * for, or — once an OwnerRegistry has wrapped the claim — the holder of its ERC-721. Anyone else
 * needs CONDUIT_PROCESS, which is what a keeper driving settlement holds.
 *
 * A query already SETTLED or REJECTED returns that state without advancing and without any
 * authorization check; one this conduit never created reverts `UnknownQuery`.
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
