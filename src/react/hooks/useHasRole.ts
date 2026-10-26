'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { type HasRoleParameters, hasRoleQueryOptions } from '../query/hasRole.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseHasRoleParameters<selectData = QueryData<typeof hasRoleQueryOptions>> =
  HasRoleParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`. */
    queryOptions?: QueryOptionsParameter<typeof hasRoleQueryOptions, selectData>
  }

export function useHasRole<selectData = QueryData<typeof hasRoleQueryOptions>>(
  parameters: UseHasRoleParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = hasRoleQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
