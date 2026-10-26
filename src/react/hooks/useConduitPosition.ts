'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type ConduitPositionParameters,
  conduitPositionQueryOptions,
} from '../query/conduitPosition.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseConduitPositionParameters<
  selectData = QueryData<typeof conduitPositionQueryOptions>,
> = ConduitPositionParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof conduitPositionQueryOptions, selectData>
}

export function useConduitPosition<selectData = QueryData<typeof conduitPositionQueryOptions>>(
  parameters: UseConduitPositionParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = conduitPositionQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
