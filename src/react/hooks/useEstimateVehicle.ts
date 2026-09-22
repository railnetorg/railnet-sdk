'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { EstimateVehicleParameters } from '../../actions/vehicle/estimateVehicle.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { estimateVehicleQueryOptions } from '../query/estimateVehicle.js'

export type UseEstimateVehicleParameters = EstimateVehicleParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useEstimateVehicle(parameters: UseEstimateVehicleParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = estimateVehicleQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
