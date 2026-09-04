'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { EstimateConduitParameters } from '../../actions/conduit/estimateConduit.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { estimateConduitQueryOptions } from '../query/estimateConduit.js'

export type UseEstimateConduitParameters = EstimateConduitParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useEstimateConduit(parameters: UseEstimateConduitParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = estimateConduitQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
