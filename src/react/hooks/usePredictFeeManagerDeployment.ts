'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictFeeManagerDeploymentParameters,
  predictFeeManagerDeploymentQueryOptions,
} from '../query/predictFeeManagerDeployment.js'

export type UsePredictFeeManagerDeploymentParameters = PredictFeeManagerDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function usePredictFeeManagerDeployment(
  parameters: UsePredictFeeManagerDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictFeeManagerDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
