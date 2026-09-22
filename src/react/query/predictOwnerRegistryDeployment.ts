import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictOwnerRegistryDeployment,
  type SpawnOwnerRegistryParameters,
} from '../../actions/ownerRegistry/spawnOwnerRegistry.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictOwnerRegistryDeploymentParameters = SpawnOwnerRegistryParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictOwnerRegistryDeploymentQueryPrefix = [
  'railnet',
  'predictOwnerRegistryDeployment',
] as const

export function predictOwnerRegistryDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictOwnerRegistryDeploymentParameters,
) {
  return [
    ...predictOwnerRegistryDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictOwnerRegistryDeploymentQueryKey = ReturnType<
  typeof predictOwnerRegistryDeploymentQueryKey
>

export function predictOwnerRegistryDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictOwnerRegistryDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictOwnerRegistryDeployment(client, parameters) : skipToken,
    queryKey: predictOwnerRegistryDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictOwnerRegistryDeploymentQueryKey
  >
}
