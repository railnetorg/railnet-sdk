'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictMultiVehicleDeploymentParameters,
  predictMultiVehicleDeploymentQueryOptions,
} from '../query/predictMultiVehicleDeployment.js'

export type UsePredictMultiVehicleDeploymentParameters = PredictMultiVehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function usePredictMultiVehicleDeployment(
  parameters: UsePredictMultiVehicleDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictMultiVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
