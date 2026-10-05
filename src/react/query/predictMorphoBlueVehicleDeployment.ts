import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictMorphoBlueVehicleDeployment,
  type SpawnMorphoBlueVehicleParameters,
} from '../../actions/vehicle/spawnMorphoBlueVehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictMorphoBlueVehicleDeploymentParameters = SpawnMorphoBlueVehicleParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictMorphoBlueVehicleDeploymentQueryPrefix = [
  'railnet',
  'predictMorphoBlueVehicleDeployment',
] as const

export function predictMorphoBlueVehicleDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictMorphoBlueVehicleDeploymentParameters,
) {
  return [
    ...predictMorphoBlueVehicleDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictMorphoBlueVehicleDeploymentQueryKey = ReturnType<
  typeof predictMorphoBlueVehicleDeploymentQueryKey
>

export function predictMorphoBlueVehicleDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictMorphoBlueVehicleDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictMorphoBlueVehicleDeployment(client, parameters) : skipToken,
    queryKey: predictMorphoBlueVehicleDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictMorphoBlueVehicleDeploymentQueryKey
  >
}
