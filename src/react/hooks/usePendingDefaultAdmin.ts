'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PendingDefaultAdminParameters,
  pendingDefaultAdminQueryOptions,
} from '../query/pendingDefaultAdmin.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePendingDefaultAdminParameters<
  selectData = QueryData<typeof pendingDefaultAdminQueryOptions>,
> = PendingDefaultAdminParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof pendingDefaultAdminQueryOptions, selectData>
}

export function usePendingDefaultAdmin<
  selectData = QueryData<typeof pendingDefaultAdminQueryOptions>,
>(parameters: UsePendingDefaultAdminParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = pendingDefaultAdminQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
