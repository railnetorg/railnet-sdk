'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictErc4626VehicleDeploymentParameters,
  predictErc4626VehicleDeploymentQueryOptions,
} from '../query/predictErc4626VehicleDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictErc4626VehicleDeploymentParameters<
  selectData = QueryData<typeof predictErc4626VehicleDeploymentQueryOptions>,
> = PredictErc4626VehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictErc4626VehicleDeploymentQueryOptions,
    selectData
  >
}

export function usePredictErc4626VehicleDeployment<
  selectData = QueryData<typeof predictErc4626VehicleDeploymentQueryOptions>,
>(parameters: UsePredictErc4626VehicleDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictErc4626VehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
