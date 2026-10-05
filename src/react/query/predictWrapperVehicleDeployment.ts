import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictWrapperVehicleDeployment,
  type SpawnWrapperVehicleParameters,
} from '../../actions/vehicle/spawnWrapperVehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictWrapperVehicleDeploymentParameters = SpawnWrapperVehicleParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictWrapperVehicleDeploymentQueryPrefix = [
  'railnet',
  'predictWrapperVehicleDeployment',
] as const

export function predictWrapperVehicleDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictWrapperVehicleDeploymentParameters,
) {
  return [
    ...predictWrapperVehicleDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictWrapperVehicleDeploymentQueryKey = ReturnType<
  typeof predictWrapperVehicleDeploymentQueryKey
>

export function predictWrapperVehicleDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictWrapperVehicleDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictWrapperVehicleDeployment(client, parameters) : skipToken,
    queryKey: predictWrapperVehicleDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictWrapperVehicleDeploymentQueryKey
  >
}
