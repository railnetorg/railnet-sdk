'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictErc4626VehicleDeploymentParameters,
  predictErc4626VehicleDeploymentQueryOptions,
} from '../query/predictErc4626VehicleDeployment.js'

export type UsePredictErc4626VehicleDeploymentParameters =
  PredictErc4626VehicleDeploymentParameters & {
    /** Chain to read from. Defaults to the connected one. */
    chainId?: number
    enabled?: boolean
  }

export function usePredictErc4626VehicleDeployment(
  parameters: UsePredictErc4626VehicleDeploymentParameters,
) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictErc4626VehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
