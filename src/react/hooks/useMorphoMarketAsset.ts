'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type MorphoMarketAssetParameters,
  morphoMarketAssetQueryOptions,
} from '../query/morphoMarketAsset.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseMorphoMarketAssetParameters<
  selectData = QueryData<typeof morphoMarketAssetQueryOptions>,
> = MorphoMarketAssetParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof morphoMarketAssetQueryOptions, selectData>
}

export function useMorphoMarketAsset<selectData = QueryData<typeof morphoMarketAssetQueryOptions>>(
  parameters: UseMorphoMarketAssetParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = morphoMarketAssetQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
