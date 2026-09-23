import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetQueryClaimParameters,
  type GetQueryClaimReturnType,
  getQueryClaim,
} from '../../actions/ownerRegistry/wrapQuery.js'
import { normalizeQueryKeyParameters } from './key.js'

export type QueryClaimParameters = GetQueryClaimParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const queryClaimQueryPrefix = ['railnet', 'queryClaim'] as const

export function queryClaimQueryKey(chainId: number | undefined, parameters: QueryClaimParameters) {
  return [
    ...queryClaimQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type QueryClaimQueryKey = ReturnType<typeof queryClaimQueryKey>

export function queryClaimQueryOptions(
  client: Client | undefined,
  parameters: QueryClaimParameters,
) {
  return {
    queryFn: client ? () => getQueryClaim(client, parameters) : skipToken,
    queryKey: queryClaimQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetQueryClaimReturnType,
    ReadContractErrorType,
    GetQueryClaimReturnType,
    QueryClaimQueryKey
  >
}
