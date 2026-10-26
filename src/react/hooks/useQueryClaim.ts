'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { type QueryClaimParameters, queryClaimQueryOptions } from '../query/queryClaim.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseQueryClaimParameters<selectData = QueryData<typeof queryClaimQueryOptions>> =
  QueryClaimParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
    queryOptions?: QueryOptionsParameter<typeof queryClaimQueryOptions, selectData>
  }

export function useQueryClaim<selectData = QueryData<typeof queryClaimQueryOptions>>(
  parameters: UseQueryClaimParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = queryClaimQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
