'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { type ConduitInfoParameters, conduitInfoQueryOptions } from '../query/conduitInfo.js'

export type UseConduitInfoParameters = ConduitInfoParameters & {
  enabled?: boolean
}

export function useConduitInfo(parameters: UseConduitInfoParameters) {
  const { enabled = true, ...queryParameters } = parameters
  const client = usePublicClient()
  const options = conduitInfoQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled: enabled && !!client,
  })
}
