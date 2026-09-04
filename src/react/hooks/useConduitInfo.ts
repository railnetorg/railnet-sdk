'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { type ConduitInfoParameters, conduitInfoQueryOptions } from '../query/conduitInfo.js'

export type UseConduitInfoParameters = ConduitInfoParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useConduitInfo(parameters: UseConduitInfoParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitInfoQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
