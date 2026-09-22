import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetPendingDefaultAdminParameters,
  type GetPendingDefaultAdminReturnType,
  getPendingDefaultAdmin,
} from '../../actions/accessControl/defaultAdminTransfer.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PendingDefaultAdminParameters = GetPendingDefaultAdminParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const pendingDefaultAdminQueryPrefix = ['railnet', 'pendingDefaultAdmin'] as const

export function pendingDefaultAdminQueryKey(
  chainId: number | undefined,
  parameters: PendingDefaultAdminParameters,
) {
  return [
    ...pendingDefaultAdminQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PendingDefaultAdminQueryKey = ReturnType<typeof pendingDefaultAdminQueryKey>

export function pendingDefaultAdminQueryOptions(
  client: Client | undefined,
  parameters: PendingDefaultAdminParameters,
) {
  return {
    queryFn: client ? () => getPendingDefaultAdmin(client, parameters) : skipToken,
    queryKey: pendingDefaultAdminQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetPendingDefaultAdminReturnType,
    ReadContractErrorType,
    GetPendingDefaultAdminReturnType,
    PendingDefaultAdminQueryKey
  >
}
