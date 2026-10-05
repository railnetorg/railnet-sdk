import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictAaveV3VehicleDeployment,
  type SpawnAaveV3VehicleParameters,
} from '../../actions/vehicle/spawnAaveV3Vehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictAaveV3VehicleDeploymentParameters = SpawnAaveV3VehicleParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictAaveV3VehicleDeploymentQueryPrefix = [
  'railnet',
  'predictAaveV3VehicleDeployment',
] as const

export function predictAaveV3VehicleDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictAaveV3VehicleDeploymentParameters,
) {
  return [
    ...predictAaveV3VehicleDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictAaveV3VehicleDeploymentQueryKey = ReturnType<
  typeof predictAaveV3VehicleDeploymentQueryKey
>

export function predictAaveV3VehicleDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictAaveV3VehicleDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictAaveV3VehicleDeployment(client, parameters) : skipToken,
    queryKey: predictAaveV3VehicleDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictAaveV3VehicleDeploymentQueryKey
  >
}
