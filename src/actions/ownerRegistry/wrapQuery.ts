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
 * Builds the `ownerRegistry.wrap()` call, which mints an ERC-721 over a live query so the claim on
 * its proceeds becomes transferable. Returns the `tokenId`.
 *
 * Five conditions, all checked on chain. The caller must be the query's registered owner
 * (`QueryNotRegistered`, `UnauthorizedWrap`); the query must not be wrapped already
 * (`QueryAlreadyWrapped`); the conduit must let the caller transfer to itself, so the same
 * allow-list, block-list and sanctions screen a transfer faces applies (`TransferNotAllowed` —
 * check it with {@link getTransferability}); and the query must still be live, since a finalized
 * one has no claim left to sell (`NonWrappableState` on `EMPTY`, `SETTLED` or `REJECTED`).
 *
 * There is deliberately no unwrap builder: `unwrap` is keyed on `msg.sender` as the conduit
 * namespace, so only the owning conduit can reach it, and it does so at finalization.
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
 * `wrap` moves the record from one to the other: it clears `owner` and sets `tokenId`, so a zero
 * `owner` with `isWrapped` true means the NFT holder owns the claim, while a zero `owner` with
 * `isWrapped` false means the registry never knew this query.
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
