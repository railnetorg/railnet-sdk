import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Query } from '../../types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: Query
}

/**
 * Builds the `conduit.process()` call, which advances a query's state. The sender is the query's
 * `receiver`, or the ERC-721 holder once an OwnerRegistry wrapped the claim; anyone else needs
 * CONDUIT_PROCESS. A query already SETTLED or REJECTED returns that state; one this conduit never
 * created reverts `UnknownQuery`.
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
