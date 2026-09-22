'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type MorphoMarketAssetParameters,
  morphoMarketAssetQueryOptions,
} from '../query/morphoMarketAsset.js'

export type UseMorphoMarketAssetParameters = MorphoMarketAssetParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useMorphoMarketAsset(parameters: UseMorphoMarketAssetParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = morphoMarketAssetQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
