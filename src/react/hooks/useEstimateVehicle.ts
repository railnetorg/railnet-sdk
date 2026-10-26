'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { EstimateVehicleParameters } from '../../actions/vehicle/estimateVehicle.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { estimateVehicleQueryOptions } from '../query/estimateVehicle.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseEstimateVehicleParameters<
  selectData = QueryData<typeof estimateVehicleQueryOptions>,
> = EstimateVehicleParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof estimateVehicleQueryOptions, selectData>
}

export function useEstimateVehicle<selectData = QueryData<typeof estimateVehicleQueryOptions>>(
  parameters: UseEstimateVehicleParameters<selectData>,
) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = estimateVehicleQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
