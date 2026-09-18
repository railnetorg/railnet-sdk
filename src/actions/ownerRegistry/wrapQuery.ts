import type { Address, Client, Hex } from 'viem'
import { multicall } from 'viem/actions'
import { ownerRegistryAbi } from '../../abi/ownerRegistry.js'
import type { Query } from '../../types.js'

export type WrapQueryParameters = {
  ownerRegistry: Address
  /** The query to wrap, exactly as the conduit created it. */
  query: Query
  /** The conduit that owns the query. The registry namespaces every record by it. */
  conduit: Address
}

/**
 * Builds the `ownerRegistry.wrap()` call, which mints an ERC-721 over a live query. Returns the
 * `tokenId`. Reverts `QueryNotRegistered` or `UnauthorizedWrap` unless the caller is the registered
 * owner, `QueryAlreadyWrapped`, `TransferNotAllowed` when the conduit refuses the caller a transfer
 * to itself, and `NonWrappableState` on `EMPTY`, `SETTLED` or `REJECTED`.
 *
 * @param parameters - {@link WrapQueryParameters}
 */
export function buildWrapQueryCall(parameters: WrapQueryParameters) {
  return {
    address: parameters.ownerRegistry,
    abi: ownerRegistryAbi,
    functionName: 'wrap',
    args: [parameters.query, parameters.conduit],
  } as const
}

export type QueryClaim = {
  /** The registered owner, or the zero address once the claim is wrapped or was never registered. */
  owner: Address
  isWrapped: boolean
  /** `0n` until the query is wrapped. */
  tokenId: bigint
}

export type GetQueryClaimParameters = {
  ownerRegistry: Address
  conduit: Address
  queryId: Hex
}

export type GetQueryClaimReturnType = QueryClaim

/**
 * Who holds the claim on a query, and whether it has been wrapped into a token yet.
 *
 * A zero `owner` reads two ways. With `isWrapped` true the NFT holder owns the claim, with it false
 * the registry never knew this query.
 *
 * @param parameters - {@link GetQueryClaimParameters}
 */
export async function getQueryClaim(
  client: Client,
  parameters: GetQueryClaimParameters,
): Promise<GetQueryClaimReturnType> {
  const { ownerRegistry, conduit, queryId } = parameters
  const call = { address: ownerRegistry, abi: ownerRegistryAbi, args: [conduit, queryId] } as const

  const [owner, isWrapped, tokenId] = await multicall(client, {
    contracts: [
      { ...call, functionName: 'getOwner' },
      { ...call, functionName: 'isWrapped' },
      { ...call, functionName: 'getTokenIdByQuery' },
    ] as const,
    allowFailure: false,
  })

  return { owner, isWrapped, tokenId }
}
