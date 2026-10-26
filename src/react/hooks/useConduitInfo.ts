'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { type ConduitInfoParameters, conduitInfoQueryOptions } from '../query/conduitInfo.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseConduitInfoParameters<selectData = QueryData<typeof conduitInfoQueryOptions>> =
  ConduitInfoParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
    queryOptions?: QueryOptionsParameter<typeof conduitInfoQueryOptions, selectData>
  }

export function useConduitInfo<selectData = QueryData<typeof conduitInfoQueryOptions>>(
  parameters: UseConduitInfoParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitInfoQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
