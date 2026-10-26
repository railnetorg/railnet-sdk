'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type InitialDepositAmountParameters,
  initialDepositAmountQueryOptions,
} from '../query/initialDepositAmount.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseInitialDepositAmountParameters<
  selectData = QueryData<typeof initialDepositAmountQueryOptions>,
> = InitialDepositAmountParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof initialDepositAmountQueryOptions, selectData>
}

export function useInitialDepositAmount<
  selectData = QueryData<typeof initialDepositAmountQueryOptions>,
>(parameters: UseInitialDepositAmountParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = initialDepositAmountQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
