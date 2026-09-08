'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type VehicleManagerLimitsParameters,
  vehicleManagerLimitsQueryOptions,
} from '../query/vehicleManagerLimits.js'

export type UseVehicleManagerLimitsParameters = VehicleManagerLimitsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
}

export function useVehicleManagerLimits(parameters: UseVehicleManagerLimitsParameters) {
  const { enabled = true, chainId, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = vehicleManagerLimitsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
