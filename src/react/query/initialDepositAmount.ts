import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetInitialDepositAmountParameters,
  type GetInitialDepositAmountReturnType,
  getInitialDepositAmount,
} from '../../actions/assetRegistry/getInitialDepositAmount.js'
import { normalizeQueryKeyParameters } from './key.js'

export type InitialDepositAmountParameters = GetInitialDepositAmountParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const initialDepositAmountQueryPrefix = ['railnet', 'initialDepositAmount'] as const

export function initialDepositAmountQueryKey(
  chainId: number | undefined,
  parameters: InitialDepositAmountParameters,
) {
  return [
    ...initialDepositAmountQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type InitialDepositAmountQueryKey = ReturnType<typeof initialDepositAmountQueryKey>

export function initialDepositAmountQueryOptions(
  client: Client | undefined,
  parameters: InitialDepositAmountParameters,
) {
  return {
    queryFn: client ? () => getInitialDepositAmount(client, parameters) : skipToken,
    queryKey: initialDepositAmountQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetInitialDepositAmountReturnType,
    ReadContractErrorType,
    GetInitialDepositAmountReturnType,
    InitialDepositAmountQueryKey
  >
}
