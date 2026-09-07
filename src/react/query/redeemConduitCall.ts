'use client'

import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  type GetRedeemConduitCallParameters,
  type GetRedeemConduitCallReturnType,
  getRedeemConduitCall,
} from '../../actions/conduit/getRedeemConduitCall.js'
import { normalizeQueryKeyParameters } from './key.js'

export type RedeemConduitCallParameters = Omit<GetRedeemConduitCallParameters, 'sender'> & {
  sender: Address | undefined
}

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const redeemConduitCallQueryPrefix = ['railnet', 'redeemConduitCall'] as const

export function redeemConduitCallQueryKey(
  chainId: number | undefined,
  parameters: RedeemConduitCallParameters,
) {
  return [
    ...redeemConduitCallQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type RedeemConduitCallQueryKey = ReturnType<typeof redeemConduitCallQueryKey>

export function redeemConduitCallQueryOptions(
  client: Client | undefined,
  parameters: RedeemConduitCallParameters,
) {
  const { sender } = parameters

  return {
    queryFn:
      client && sender ? () => getRedeemConduitCall(client, { ...parameters, sender }) : skipToken,
    queryKey: redeemConduitCallQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetRedeemConduitCallReturnType,
    ReadContractErrorType,
    GetRedeemConduitCallReturnType,
    RedeemConduitCallQueryKey
  >
}
