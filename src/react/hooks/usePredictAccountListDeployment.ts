'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictAccountListDeploymentParameters,
  predictAccountListDeploymentQueryOptions,
} from '../query/predictAccountListDeployment.js'

export type UsePredictAccountListDeploymentParameters = PredictAccountListDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function usePredictAccountListDeployment(
  parameters: UsePredictAccountListDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictAccountListDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
