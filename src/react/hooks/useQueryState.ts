'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { type QueryStateParameters, queryStateQueryOptions } from '../query/queryState.js'

export type UseQueryStateParameters = QueryStateParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useQueryState(parameters: UseQueryStateParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = queryStateQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
