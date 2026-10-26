'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import {
  type AccountListStatusParameters,
  accountListStatusQueryOptions,
} from '../query/accountListStatus.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseAccountListStatusParameters<
  selectData = QueryData<typeof accountListStatusQueryOptions>,
> = AccountListStatusParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof accountListStatusQueryOptions, selectData>
}

export function useAccountListStatus<selectData = QueryData<typeof accountListStatusQueryOptions>>(
  parameters: UseAccountListStatusParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = accountListStatusQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
