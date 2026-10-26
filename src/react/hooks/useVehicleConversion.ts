'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'
import {
  type VehicleConversionParameters,
  vehicleConversionQueryOptions,
} from '../query/vehicleConversion.js'

export type UseVehicleConversionParameters<
  selectData = QueryData<typeof vehicleConversionQueryOptions>,
> = VehicleConversionParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof vehicleConversionQueryOptions, selectData>
}

export function useVehicleConversion<selectData = QueryData<typeof vehicleConversionQueryOptions>>(
  parameters: UseVehicleConversionParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = vehicleConversionQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
