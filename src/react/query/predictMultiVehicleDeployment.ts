import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  predictMultiVehicleDeployment,
  type SpawnMultiVehicleParameters,
} from '../../actions/multiVehicle/spawnMultiVehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictMultiVehicleDeploymentParameters = SpawnMultiVehicleParameters

export type PredictMultiVehicleDeploymentReturnType = Awaited<
  ReturnType<typeof predictMultiVehicleDeployment>
>

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictMultiVehicleDeploymentQueryPrefix = [
  'railnet',
  'predictMultiVehicleDeployment',
] as const

export function predictMultiVehicleDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictMultiVehicleDeploymentParameters,
) {
  return [
    ...predictMultiVehicleDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictMultiVehicleDeploymentQueryKey = ReturnType<
  typeof predictMultiVehicleDeploymentQueryKey
>

export function predictMultiVehicleDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictMultiVehicleDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictMultiVehicleDeployment(client, parameters) : skipToken,
    queryKey: predictMultiVehicleDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    PredictMultiVehicleDeploymentReturnType,
    ReadContractErrorType,
    PredictMultiVehicleDeploymentReturnType,
    PredictMultiVehicleDeploymentQueryKey
  >
}
