import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictAccessControlDeployment,
  type SpawnAccessControlParameters,
} from '../../actions/accessControl/spawnAccessControl.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictAccessControlDeploymentParameters = SpawnAccessControlParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictAccessControlDeploymentQueryPrefix = [
  'railnet',
  'predictAccessControlDeployment',
] as const

export function predictAccessControlDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictAccessControlDeploymentParameters,
) {
  return [
    ...predictAccessControlDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictAccessControlDeploymentQueryKey = ReturnType<
  typeof predictAccessControlDeploymentQueryKey
>

export function predictAccessControlDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictAccessControlDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictAccessControlDeployment(client, parameters) : skipToken,
    queryKey: predictAccessControlDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictAccessControlDeploymentQueryKey
  >
}
