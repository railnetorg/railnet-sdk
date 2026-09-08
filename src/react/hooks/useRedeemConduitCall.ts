'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type RedeemConduitCallParameters,
  redeemConduitCallQueryOptions,
} from '../query/redeemConduitCall.js'

export type UseRedeemConduitCallParameters = RedeemConduitCallParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

/**
 * Resolves the redeem call and the salt its query will carry. Hand `call` to wagmi's
 * `useSimulateContract` and `useWriteContract` to send it.
 */
export function useRedeemConduitCall(parameters: UseRedeemConduitCallParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = redeemConduitCallQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
