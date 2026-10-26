'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type MorphoBlueSingletonParameters,
  morphoBlueSingletonQueryOptions,
} from '../query/morphoBlueSingleton.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseMorphoBlueSingletonParameters<
  selectData = QueryData<typeof morphoBlueSingletonQueryOptions>,
> = MorphoBlueSingletonParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof morphoBlueSingletonQueryOptions, selectData>
}

export function useMorphoBlueSingleton<
  selectData = QueryData<typeof morphoBlueSingletonQueryOptions>,
>(parameters: UseMorphoBlueSingletonParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = morphoBlueSingletonQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
