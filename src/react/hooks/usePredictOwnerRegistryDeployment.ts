'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictOwnerRegistryDeploymentParameters,
  predictOwnerRegistryDeploymentQueryOptions,
} from '../query/predictOwnerRegistryDeployment.js'

export type UsePredictOwnerRegistryDeploymentParameters =
  PredictOwnerRegistryDeploymentParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
  }

export function usePredictOwnerRegistryDeployment(
  parameters: UsePredictOwnerRegistryDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictOwnerRegistryDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
