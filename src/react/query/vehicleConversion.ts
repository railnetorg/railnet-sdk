import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetVehicleConversionParameters,
  type GetVehicleConversionReturnType,
  getVehicleConversion,
} from '../../actions/vehicle/getVehicleConversion.js'
import { normalizeQueryKeyParameters } from './key.js'

export type VehicleConversionParameters = GetVehicleConversionParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const vehicleConversionQueryPrefix = ['railnet', 'vehicleConversion'] as const

export function vehicleConversionQueryKey(
  chainId: number | undefined,
  parameters: VehicleConversionParameters,
) {
  return [
    ...vehicleConversionQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type VehicleConversionQueryKey = ReturnType<typeof vehicleConversionQueryKey>

export function vehicleConversionQueryOptions(
  client: Client | undefined,
  parameters: VehicleConversionParameters,
) {
  return {
    queryFn: client ? () => getVehicleConversion(client, parameters) : skipToken,
    queryKey: vehicleConversionQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetVehicleConversionReturnType,
    ReadContractErrorType,
    GetVehicleConversionReturnType,
    VehicleConversionQueryKey
  >
}
