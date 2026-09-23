import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictFeeManagerDeployment,
  type SpawnFeeManagerParameters,
} from '../../actions/feeManager/spawnFeeManager.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictFeeManagerDeploymentParameters = SpawnFeeManagerParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictFeeManagerDeploymentQueryPrefix = [
  'railnet',
  'predictFeeManagerDeployment',
] as const

export function predictFeeManagerDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictFeeManagerDeploymentParameters,
) {
  return [
    ...predictFeeManagerDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictFeeManagerDeploymentQueryKey = ReturnType<
  typeof predictFeeManagerDeploymentQueryKey
>

export function predictFeeManagerDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictFeeManagerDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictFeeManagerDeployment(client, parameters) : skipToken,
    queryKey: predictFeeManagerDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictFeeManagerDeploymentQueryKey
  >
}
