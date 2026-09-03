'use client'

import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import type { PredictConduitDeploymentParameters } from '../../actions/conduit/predictConduitDeployment.js'
import { predictConduitDeployment } from '../../actions/conduit/predictConduitDeployment.js'
import { normalizeQueryKeyValue } from './key.js'

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const predictConduitDeploymentQueryPrefix = ['railnet', 'predictConduitDeployment'] as const

export function predictConduitDeploymentQueryKey(
  chainId: number | undefined,
  parameters: PredictConduitDeploymentParameters,
) {
  return [
    ...predictConduitDeploymentQueryPrefix,
    { chainId, ...(normalizeQueryKeyValue(parameters) as PredictConduitDeploymentParameters) },
  ] as const
}

export type PredictConduitDeploymentQueryKey = ReturnType<typeof predictConduitDeploymentQueryKey>

export function predictConduitDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictConduitDeploymentParameters,
) {
  return {
    queryFn: client ? () => predictConduitDeployment(client, parameters) : skipToken,
    queryKey: predictConduitDeploymentQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictConduitDeploymentQueryKey
  >
}
