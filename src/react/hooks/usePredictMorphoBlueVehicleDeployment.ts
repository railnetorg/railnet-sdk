'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictMorphoBlueVehicleDeploymentParameters,
  predictMorphoBlueVehicleDeploymentQueryOptions,
} from '../query/predictMorphoBlueVehicleDeployment.js'

export type UsePredictMorphoBlueVehicleDeploymentParameters =
  PredictMorphoBlueVehicleDeploymentParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
  }

export function usePredictMorphoBlueVehicleDeployment(
  parameters: UsePredictMorphoBlueVehicleDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictMorphoBlueVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
