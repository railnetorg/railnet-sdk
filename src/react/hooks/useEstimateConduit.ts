'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { EstimateConduitParameters } from '../../actions/conduit/estimateConduit.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { estimateConduitQueryOptions } from '../query/estimateConduit.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseEstimateConduitParameters<
  selectData = QueryData<typeof estimateConduitQueryOptions>,
> = EstimateConduitParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof estimateConduitQueryOptions, selectData>
}

export function useEstimateConduit<selectData = QueryData<typeof estimateConduitQueryOptions>>(
  parameters: UseEstimateConduitParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = estimateConduitQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
