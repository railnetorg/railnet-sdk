import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictErc4626VehicleDeployment,
  type SpawnErc4626VehicleParameters,
} from '../../actions/vehicle/spawnErc4626Vehicle.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictErc4626VehicleDeploymentParameters = SpawnErc4626VehicleParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictErc4626VehicleDeploymentQueryPrefix = [
  'railnet',
  'predictErc4626VehicleDeployment',
] as const

export function predictErc4626VehicleDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictErc4626VehicleDeploymentParameters,
) {
  return [
    ...predictErc4626VehicleDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictErc4626VehicleDeploymentQueryKey = ReturnType<
  typeof predictErc4626VehicleDeploymentQueryKey
>

export function predictErc4626VehicleDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictErc4626VehicleDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictErc4626VehicleDeployment(client, parameters) : skipToken,
    queryKey: predictErc4626VehicleDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictErc4626VehicleDeploymentQueryKey
  >
}
