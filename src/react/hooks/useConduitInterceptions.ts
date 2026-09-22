'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type ConduitInterceptionsParameters,
  conduitInterceptionsQueryOptions,
} from '../query/conduitInterceptions.js'

export type UseConduitInterceptionsParameters = ConduitInterceptionsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useConduitInterceptions(parameters: UseConduitInterceptionsParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitInterceptionsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
