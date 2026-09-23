import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type EstimateVehicleParameters,
  type EstimateVehicleReturnType,
  estimateVehicle,
} from '../../actions/vehicle/estimateVehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const estimateVehicleQueryPrefix = ['railnet', 'estimateVehicle'] as const

export function estimateVehicleQueryKey(
  chainId: number | undefined,
  parameters: EstimateVehicleParameters,
) {
  return [
    ...estimateVehicleQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type EstimateVehicleQueryKey = ReturnType<typeof estimateVehicleQueryKey>

export function estimateVehicleQueryOptions(
  client: Client | undefined,
  parameters: EstimateVehicleParameters,
) {
  return {
    queryFn: client ? () => estimateVehicle(client, parameters) : skipToken,
    queryKey: estimateVehicleQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    EstimateVehicleReturnType,
    ReadContractErrorType,
    EstimateVehicleReturnType,
    EstimateVehicleQueryKey
  >
}
