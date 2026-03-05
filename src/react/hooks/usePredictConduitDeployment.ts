'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { PredictConduitDeploymentParameters } from '../../actions/conduit/predictConduitDeployment.js'
import { predictConduitDeploymentQueryOptions } from '../query/predictConduitDeployment.js'

export type UsePredictConduitDeploymentParameters = PredictConduitDeploymentParameters & {
  enabled?: boolean
}

export function usePredictConduitDeployment(parameters: UsePredictConduitDeploymentParameters) {
  const { enabled = true, ...queryParameters } = parameters
  const client = usePublicClient()
  const options = predictConduitDeploymentQueryOptions(client, queryParameters)

  return useQuery({
    ...options,
    enabled: enabled && !!client,
  })
}
