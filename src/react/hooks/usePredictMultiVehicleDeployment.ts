'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictMultiVehicleDeploymentParameters,
  predictMultiVehicleDeploymentQueryOptions,
} from '../query/predictMultiVehicleDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictMultiVehicleDeploymentParameters<
  selectData = QueryData<typeof predictMultiVehicleDeploymentQueryOptions>,
> = PredictMultiVehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof predictMultiVehicleDeploymentQueryOptions, selectData>
}

export function usePredictMultiVehicleDeployment<
  selectData = QueryData<typeof predictMultiVehicleDeploymentQueryOptions>,
>(parameters: UsePredictMultiVehicleDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictMultiVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
