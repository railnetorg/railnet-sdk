import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetIsTransferableParameters,
  type GetIsTransferableReturnType,
  getIsTransferable,
} from '../../actions/conduit/getIsTransferable.js'
import { normalizeQueryKeyParameters } from './key.js'

export type IsTransferableParameters = GetIsTransferableParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const isTransferableQueryPrefix = ['railnet', 'isTransferable'] as const

export function isTransferableQueryKey(
  chainId: number | undefined,
  parameters: IsTransferableParameters,
) {
  return [
    ...isTransferableQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type IsTransferableQueryKey = ReturnType<typeof isTransferableQueryKey>

export function isTransferableQueryOptions(
  client: Client | undefined,
  parameters: IsTransferableParameters,
) {
  return {
    queryFn: client ? () => getIsTransferable(client, parameters) : skipToken,
    queryKey: isTransferableQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetIsTransferableReturnType,
    ReadContractErrorType,
    GetIsTransferableReturnType,
    IsTransferableQueryKey
  >
}
