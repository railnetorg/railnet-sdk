import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetHasRoleParameters,
  type GetHasRoleReturnType,
  getHasRole,
} from '../../actions/accessControl/getHasRole.js'
import { normalizeQueryKeyParameters } from './key.js'

export type HasRoleParameters = GetHasRoleParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const hasRoleQueryPrefix = ['railnet', 'hasRole'] as const

export function hasRoleQueryKey(chainId: number | undefined, parameters: HasRoleParameters) {
  return [...hasRoleQueryPrefix, { ...normalizeQueryKeyParameters(parameters), chainId }] as const
}

export type HasRoleQueryKey = ReturnType<typeof hasRoleQueryKey>

export function hasRoleQueryOptions(client: Client | undefined, parameters: HasRoleParameters) {
  return {
    queryFn: client ? () => getHasRole(client, parameters) : skipToken,
    queryKey: hasRoleQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetHasRoleReturnType,
    ReadContractErrorType,
    GetHasRoleReturnType,
    HasRoleQueryKey
  >
}
