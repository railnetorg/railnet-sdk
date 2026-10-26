'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type DepositConduitCallParameters,
  depositConduitCallQueryOptions,
} from '../query/depositConduitCall.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseDepositConduitCallParameters<
  selectData = QueryData<typeof depositConduitCallQueryOptions>,
> = DepositConduitCallParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof depositConduitCallQueryOptions, selectData>
}

/**
 * Resolves the deposit call and the id of the query it will create. Hand `call` to wagmi's
 * `useSimulateContract` and `useWriteContract` to send it. Keep `salt` stable for the length of
 * the operation; a new one is a different query and a different `queryId`.
 */
export function useDepositConduitCall<
  selectData = QueryData<typeof depositConduitCallQueryOptions>,
>(parameters: UseDepositConduitCallParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = depositConduitCallQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
