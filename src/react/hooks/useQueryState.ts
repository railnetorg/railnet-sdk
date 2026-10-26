'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'
import { type QueryStateParameters, queryStateQueryOptions } from '../query/queryState.js'

export type UseQueryStateParameters<selectData = QueryData<typeof queryStateQueryOptions>> =
  QueryStateParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`. */
    queryOptions?: QueryOptionsParameter<typeof queryStateQueryOptions, selectData>
  }

export function useQueryState<selectData = QueryData<typeof queryStateQueryOptions>>(
  parameters: UseQueryStateParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = queryStateQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
