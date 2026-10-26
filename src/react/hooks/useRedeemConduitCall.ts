'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'
import {
  type RedeemConduitCallParameters,
  redeemConduitCallQueryOptions,
} from '../query/redeemConduitCall.js'

export type UseRedeemConduitCallParameters<
  selectData = QueryData<typeof redeemConduitCallQueryOptions>,
> = RedeemConduitCallParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof redeemConduitCallQueryOptions, selectData>
}

/**
 * Resolves the redeem call and the salt its query will carry. Hand `call` to wagmi's
 * `useSimulateContract` and `useWriteContract` to send it.
 */
export function useRedeemConduitCall<selectData = QueryData<typeof redeemConduitCallQueryOptions>>(
  parameters: UseRedeemConduitCallParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = redeemConduitCallQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
