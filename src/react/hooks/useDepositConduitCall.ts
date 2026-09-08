'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type DepositConduitCallParameters,
  depositConduitCallQueryOptions,
} from '../query/depositConduitCall.js'

export type UseDepositConduitCallParameters = DepositConduitCallParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

/**
 * Resolves the deposit call and the id of the query it will create. Hand `call` to wagmi's
 * `useSimulateContract` and `useWriteContract` to send it. Keep `salt` stable for the length of the
 * operation — a new one is a different query, and so a different `queryId`.
 */
export function useDepositConduitCall(parameters: UseDepositConduitCallParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = depositConduitCallQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
