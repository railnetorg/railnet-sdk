'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import {
  type ConduitPositionParameters,
  conduitPositionQueryOptions,
} from '../query/conduitPosition.js'

export type UseConduitPositionParameters = ConduitPositionParameters & {
  enabled?: boolean
}

export function useConduitPosition(parameters: UseConduitPositionParameters) {
  const { enabled = true, ...queryParameters } = parameters
  const client = usePublicClient()
  const options = conduitPositionQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled: enabled && !!queryParameters.account && !!client,
  })
}
