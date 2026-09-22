import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetConduitInterceptionsParameters,
  type GetInterceptionsReturnType,
  getConduitInterceptions,
} from '../../actions/interceptions/getInterceptions.js'
import { normalizeQueryKeyParameters } from './key.js'

export type ConduitInterceptionsParameters = GetConduitInterceptionsParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const conduitInterceptionsQueryPrefix = ['railnet', 'conduitInterceptions'] as const

export function conduitInterceptionsQueryKey(
  chainId: number | undefined,
  parameters: ConduitInterceptionsParameters,
) {
  return [
    ...conduitInterceptionsQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type ConduitInterceptionsQueryKey = ReturnType<typeof conduitInterceptionsQueryKey>

export function conduitInterceptionsQueryOptions(
  client: Client | undefined,
  parameters: ConduitInterceptionsParameters,
) {
  return {
    queryFn: client ? () => getConduitInterceptions(client, parameters) : skipToken,
    queryKey: conduitInterceptionsQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetInterceptionsReturnType,
    ReadContractErrorType,
    GetInterceptionsReturnType,
    ConduitInterceptionsQueryKey
  >
}
