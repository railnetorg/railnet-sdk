'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { PredictConduitDeploymentParameters } from '../../actions/conduit/predictConduitDeployment.js'
import { predictConduitDeploymentQueryOptions } from '../query/predictConduitDeployment.js'

export type UsePredictConduitDeploymentParameters = PredictConduitDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function usePredictConduitDeployment(parameters: UsePredictConduitDeploymentParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictConduitDeploymentQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled,
  })
}
