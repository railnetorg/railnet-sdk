import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetInterceptionsReturnType,
  type GetVehicleInterceptionsParameters,
  getVehicleInterceptions,
} from '../../actions/interceptions/getInterceptions.js'
import { normalizeQueryKeyParameters } from './key.js'

export type VehicleInterceptionsParameters = GetVehicleInterceptionsParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const vehicleInterceptionsQueryPrefix = ['railnet', 'vehicleInterceptions'] as const

export function vehicleInterceptionsQueryKey(
  chainId: number | undefined,
  parameters: VehicleInterceptionsParameters,
) {
  return [
    ...vehicleInterceptionsQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type VehicleInterceptionsQueryKey = ReturnType<typeof vehicleInterceptionsQueryKey>

export function vehicleInterceptionsQueryOptions(
  client: Client | undefined,
  parameters: VehicleInterceptionsParameters,
) {
  return {
    queryFn: client ? () => getVehicleInterceptions(client, parameters) : skipToken,
    queryKey: vehicleInterceptionsQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetInterceptionsReturnType,
    ReadContractErrorType,
    GetInterceptionsReturnType,
    VehicleInterceptionsQueryKey
  >
}
