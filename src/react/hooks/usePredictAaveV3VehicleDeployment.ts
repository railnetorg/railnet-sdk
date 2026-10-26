'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictAaveV3VehicleDeploymentParameters,
  predictAaveV3VehicleDeploymentQueryOptions,
} from '../query/predictAaveV3VehicleDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictAaveV3VehicleDeploymentParameters<
  selectData = QueryData<typeof predictAaveV3VehicleDeploymentQueryOptions>,
> = PredictAaveV3VehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictAaveV3VehicleDeploymentQueryOptions,
    selectData
  >
}

export function usePredictAaveV3VehicleDeployment<
  selectData = QueryData<typeof predictAaveV3VehicleDeploymentQueryOptions>,
>(parameters: UsePredictAaveV3VehicleDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictAaveV3VehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
