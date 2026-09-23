'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PendingDefaultAdminParameters,
  pendingDefaultAdminQueryOptions,
} from '../query/pendingDefaultAdmin.js'

export type UsePendingDefaultAdminParameters = PendingDefaultAdminParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function usePendingDefaultAdmin(parameters: UsePendingDefaultAdminParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = pendingDefaultAdminQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
