'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import {
  type ConduitPositionParameters,
  conduitPositionQueryOptions,
} from '../query/conduitPosition.js'

export type UseConduitPositionParameters = ConduitPositionParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useConduitPosition(parameters: UseConduitPositionParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitPositionQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled,
  })
}
