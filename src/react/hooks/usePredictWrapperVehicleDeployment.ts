'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictWrapperVehicleDeploymentParameters,
  predictWrapperVehicleDeploymentQueryOptions,
} from '../query/predictWrapperVehicleDeployment.js'

export type UsePredictWrapperVehicleDeploymentParameters =
  PredictWrapperVehicleDeploymentParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
  }

export function usePredictWrapperVehicleDeployment(
  parameters: UsePredictWrapperVehicleDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictWrapperVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
