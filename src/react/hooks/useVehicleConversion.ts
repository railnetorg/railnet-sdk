'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type VehicleConversionParameters,
  vehicleConversionQueryOptions,
} from '../query/vehicleConversion.js'

export type UseVehicleConversionParameters = VehicleConversionParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useVehicleConversion(parameters: UseVehicleConversionParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = vehicleConversionQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
