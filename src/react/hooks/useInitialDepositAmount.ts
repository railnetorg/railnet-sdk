'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type InitialDepositAmountParameters,
  initialDepositAmountQueryOptions,
} from '../query/initialDepositAmount.js'

export type UseInitialDepositAmountParameters = InitialDepositAmountParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useInitialDepositAmount(parameters: UseInitialDepositAmountParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = initialDepositAmountQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
