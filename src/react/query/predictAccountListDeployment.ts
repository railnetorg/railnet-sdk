import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  predictAccountListDeployment,
  type SpawnAccountListParameters,
} from '../../actions/accountList/spawnAccountList.js'
import { normalizeQueryKeyParameters } from './key.js'

export type PredictAccountListDeploymentParameters = SpawnAccountListParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictAccountListDeploymentQueryPrefix = [
  'railnet',
  'predictAccountListDeployment',
] as const

export function predictAccountListDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictAccountListDeploymentParameters,
) {
  return [
    ...predictAccountListDeploymentQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type PredictAccountListDeploymentQueryKey = ReturnType<
  typeof predictAccountListDeploymentQueryKey
>

export function predictAccountListDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictAccountListDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictAccountListDeployment(client, parameters) : skipToken,
    queryKey: predictAccountListDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictAccountListDeploymentQueryKey
  >
}
