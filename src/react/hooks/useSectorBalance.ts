'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'
import { type SectorBalanceParameters, sectorBalanceQueryOptions } from '../query/sectorBalance.js'

export type UseSectorBalanceParameters<selectData = QueryData<typeof sectorBalanceQueryOptions>> =
  SectorBalanceParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
    queryOptions?: QueryOptionsParameter<typeof sectorBalanceQueryOptions, selectData>
  }

export function useSectorBalance<selectData = QueryData<typeof sectorBalanceQueryOptions>>(
  parameters: UseSectorBalanceParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = sectorBalanceQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
