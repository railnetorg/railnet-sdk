import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetSectorBalanceParameters,
  type GetSectorBalanceReturnType,
  getSectorBalance,
} from '../../actions/multiVehicle/getSectorBalance.js'
import { normalizeQueryKeyParameters } from './key.js'

export type SectorBalanceParameters = GetSectorBalanceParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const sectorBalanceQueryPrefix = ['railnet', 'sectorBalance'] as const

export function sectorBalanceQueryKey(
  chainId: number | undefined,
  parameters: SectorBalanceParameters,
) {
  return [
    ...sectorBalanceQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type SectorBalanceQueryKey = ReturnType<typeof sectorBalanceQueryKey>

export function sectorBalanceQueryOptions(
  client: Client | undefined,
  parameters: SectorBalanceParameters,
) {
  return {
    queryFn: client ? () => getSectorBalance(client, parameters) : skipToken,
    queryKey: sectorBalanceQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetSectorBalanceReturnType,
    ReadContractErrorType,
    GetSectorBalanceReturnType,
    SectorBalanceQueryKey
  >
}
