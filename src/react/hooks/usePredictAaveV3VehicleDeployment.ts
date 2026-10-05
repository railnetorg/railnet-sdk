'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictAaveV3VehicleDeploymentParameters,
  predictAaveV3VehicleDeploymentQueryOptions,
} from '../query/predictAaveV3VehicleDeployment.js'

export type UsePredictAaveV3VehicleDeploymentParameters =
  PredictAaveV3VehicleDeploymentParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
  }

export function usePredictAaveV3VehicleDeployment(
  parameters: UsePredictAaveV3VehicleDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictAaveV3VehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
