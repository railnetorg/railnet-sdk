'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type VehicleInterceptionsParameters,
  vehicleInterceptionsQueryOptions,
} from '../query/vehicleInterceptions.js'

export type UseVehicleInterceptionsParameters = VehicleInterceptionsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useVehicleInterceptions(parameters: UseVehicleInterceptionsParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = vehicleInterceptionsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
