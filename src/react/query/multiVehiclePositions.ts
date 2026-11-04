import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetMultiVehiclePositionsParameters,
  type GetMultiVehiclePositionsReturnType,
  getMultiVehiclePositions,
} from '../../actions/multiVehicle/getMultiVehiclePositions.js'
import { normalizeQueryKeyParameters } from './key.js'

export type MultiVehiclePositionsParameters = GetMultiVehiclePositionsParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const multiVehiclePositionsQueryPrefix = ['railnet', 'multiVehiclePositions'] as const

export function multiVehiclePositionsQueryKey(
  chainId: number | undefined,
  parameters: MultiVehiclePositionsParameters,
) {
  return [
    ...multiVehiclePositionsQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type MultiVehiclePositionsQueryKey = ReturnType<typeof multiVehiclePositionsQueryKey>

export function multiVehiclePositionsQueryOptions(
  client: Client | undefined,
  parameters: MultiVehiclePositionsParameters,
) {
  return {
    queryFn: client ? () => getMultiVehiclePositions(client, parameters) : skipToken,
    queryKey: multiVehiclePositionsQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetMultiVehiclePositionsReturnType,
    ReadContractErrorType,
    GetMultiVehiclePositionsReturnType,
    MultiVehiclePositionsQueryKey
  >
}
