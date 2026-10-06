import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetQueryStateParameters,
  type GetQueryStateReturnType,
  getQueryState,
} from '../../actions/vehicle/getQueryState.js'
import { normalizeQueryKeyParameters } from './key.js'

export type QueryStateParameters = GetQueryStateParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const queryStateQueryPrefix = ['railnet', 'queryState'] as const

export function queryStateQueryKey(chainId: number | undefined, parameters: QueryStateParameters) {
  return [
    ...queryStateQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type QueryStateQueryKey = ReturnType<typeof queryStateQueryKey>

export function queryStateQueryOptions(
  client: Client | undefined,
  parameters: QueryStateParameters,
) {
  return {
    queryFn: client ? () => getQueryState(client, parameters) : skipToken,
    queryKey: queryStateQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetQueryStateReturnType,
    ReadContractErrorType,
    GetQueryStateReturnType,
    QueryStateQueryKey
  >
}
