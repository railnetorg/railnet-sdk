'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type ConduitInterceptionsParameters,
  conduitInterceptionsQueryOptions,
} from '../query/conduitInterceptions.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseConduitInterceptionsParameters<
  selectData = QueryData<typeof conduitInterceptionsQueryOptions>,
> = ConduitInterceptionsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof conduitInterceptionsQueryOptions, selectData>
}

export function useConduitInterceptions<
  selectData = QueryData<typeof conduitInterceptionsQueryOptions>,
>(parameters: UseConduitInterceptionsParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitInterceptionsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
