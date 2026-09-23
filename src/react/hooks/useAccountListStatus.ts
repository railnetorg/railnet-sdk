'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import {
  type AccountListStatusParameters,
  accountListStatusQueryOptions,
} from '../query/accountListStatus.js'
import { attachQueryKey } from '../query/attachQueryKey.js'

export type UseAccountListStatusParameters = AccountListStatusParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useAccountListStatus(parameters: UseAccountListStatusParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = accountListStatusQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
