'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'
import {
  type VehicleManagerLimitsParameters,
  vehicleManagerLimitsQueryOptions,
} from '../query/vehicleManagerLimits.js'

export type UseVehicleManagerLimitsParameters<
  selectData = QueryData<typeof vehicleManagerLimitsQueryOptions>,
> = VehicleManagerLimitsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof vehicleManagerLimitsQueryOptions, selectData>
}

export function useVehicleManagerLimits<
  selectData = QueryData<typeof vehicleManagerLimitsQueryOptions>,
>(parameters: UseVehicleManagerLimitsParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = vehicleManagerLimitsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
