import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetAccountListStatusParameters,
  type GetAccountListStatusReturnType,
  getAccountListStatus,
} from '../../actions/accountList/getAccountListStatus.js'
import { normalizeQueryKeyParameters } from './key.js'

export type AccountListStatusParameters = GetAccountListStatusParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const accountListStatusQueryPrefix = ['railnet', 'accountListStatus'] as const

export function accountListStatusQueryKey(
  chainId: number | undefined,
  parameters: AccountListStatusParameters,
) {
  return [
    ...accountListStatusQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type AccountListStatusQueryKey = ReturnType<typeof accountListStatusQueryKey>

export function accountListStatusQueryOptions(
  client: Client | undefined,
  parameters: AccountListStatusParameters,
) {
  return {
    queryFn: client ? () => getAccountListStatus(client, parameters) : skipToken,
    queryKey: accountListStatusQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetAccountListStatusReturnType,
    ReadContractErrorType,
    GetAccountListStatusReturnType,
    AccountListStatusQueryKey
  >
}
