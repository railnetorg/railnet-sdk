'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictWrapperVehicleDeploymentParameters,
  predictWrapperVehicleDeploymentQueryOptions,
} from '../query/predictWrapperVehicleDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictWrapperVehicleDeploymentParameters<
  selectData = QueryData<typeof predictWrapperVehicleDeploymentQueryOptions>,
> = PredictWrapperVehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictWrapperVehicleDeploymentQueryOptions,
    selectData
  >
}

export function usePredictWrapperVehicleDeployment<
  selectData = QueryData<typeof predictWrapperVehicleDeploymentQueryOptions>,
>(parameters: UsePredictWrapperVehicleDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictWrapperVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
