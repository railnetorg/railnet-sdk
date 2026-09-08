'use client'

import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  type GetDepositConduitCallParameters,
  type GetDepositConduitCallReturnType,
  getDepositConduitCall,
} from '../../actions/conduit/getDepositConduitCall.js'
import { normalizeQueryKeyParameters } from './key.js'

export type DepositConduitCallParameters = Omit<GetDepositConduitCallParameters, 'sender'> & {
  sender: Address | undefined
}

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const depositConduitCallQueryPrefix = ['railnet', 'depositConduitCall'] as const

export function depositConduitCallQueryKey(
  chainId: number | undefined,
  parameters: DepositConduitCallParameters,
) {
  return [
    ...depositConduitCallQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type DepositConduitCallQueryKey = ReturnType<typeof depositConduitCallQueryKey>

export function depositConduitCallQueryOptions(
  client: Client | undefined,
  parameters: DepositConduitCallParameters,
) {
  const { sender } = parameters

  return {
    queryFn:
      client && sender ? () => getDepositConduitCall(client, { ...parameters, sender }) : skipToken,
    queryKey: depositConduitCallQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetDepositConduitCallReturnType,
    ReadContractErrorType,
    GetDepositConduitCallReturnType,
    DepositConduitCallQueryKey
  >
}
