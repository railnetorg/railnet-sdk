'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { EstimateConduitParameters } from '../../actions/conduit/types.js'
import { estimateConduitQueryOptions } from '../query/estimateConduit.js'

export type UseEstimateConduitParameters = EstimateConduitParameters & {
  enabled?: boolean
}

export function useEstimateConduit(parameters: UseEstimateConduitParameters) {
  const { enabled = true, ...queryParameters } = parameters
  const client = usePublicClient()
  const options = estimateConduitQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled: enabled && !!client,
  })
}
