'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type IsTransferableParameters,
  isTransferableQueryOptions,
} from '../query/isTransferable.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseIsTransferableParameters<selectData = QueryData<typeof isTransferableQueryOptions>> =
  IsTransferableParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
    /** Forwarded to `useQuery`. */
    queryOptions?: QueryOptionsParameter<typeof isTransferableQueryOptions, selectData>
  }

export function useIsTransferable<selectData = QueryData<typeof isTransferableQueryOptions>>(
  parameters: UseIsTransferableParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = isTransferableQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
