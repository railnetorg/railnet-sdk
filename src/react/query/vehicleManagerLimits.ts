import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetVehicleManagerLimitsParameters,
  type GetVehicleManagerLimitsReturnType,
  getVehicleManagerLimits,
} from '../../actions/multiVehicle/getVehicleManagerLimits.js'
import { normalizeQueryKeyParameters } from './key.js'

export type VehicleManagerLimitsParameters = GetVehicleManagerLimitsParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const vehicleManagerLimitsQueryPrefix = ['railnet', 'vehicleManagerLimits'] as const

export function vehicleManagerLimitsQueryKey(
  chainId: number | undefined,
  parameters: VehicleManagerLimitsParameters,
) {
  return [
    ...vehicleManagerLimitsQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type VehicleManagerLimitsQueryKey = ReturnType<typeof vehicleManagerLimitsQueryKey>

export function vehicleManagerLimitsQueryOptions(
  client: Client | undefined,
  parameters: VehicleManagerLimitsParameters,
) {
  return {
    queryFn: client ? () => getVehicleManagerLimits(client, parameters) : skipToken,
    queryKey: vehicleManagerLimitsQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetVehicleManagerLimitsReturnType,
    ReadContractErrorType,
    GetVehicleManagerLimitsReturnType,
    VehicleManagerLimitsQueryKey
  >
}
