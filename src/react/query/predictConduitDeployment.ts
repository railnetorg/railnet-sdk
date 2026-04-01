'use client'

import type { QueryOptions } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import type { PredictConduitDeploymentParameters } from '../../actions/conduit/predictConduitDeployment.js'
import { predictConduitDeployment } from '../../actions/conduit/predictConduitDeployment.js'

export function predictConduitDeploymentQueryKey(parameters: PredictConduitDeploymentParameters) {
  return ['railnet', 'predictConduitDeployment', parameters] as const
}

export type PredictConduitDeploymentQueryKey = ReturnType<typeof predictConduitDeploymentQueryKey>

export function predictConduitDeploymentQueryOptions(
  client: Client | undefined,
  parameters: PredictConduitDeploymentParameters,
) {
  return {
    async queryFn() {
      if (!client) throw new Error('Public client not available')
      return predictConduitDeployment(client, parameters)
    },
    queryKey: predictConduitDeploymentQueryKey(parameters),
  } as const satisfies QueryOptions<
    Address,
    ReadContractErrorType,
    Address,
    PredictConduitDeploymentQueryKey
  >
}
