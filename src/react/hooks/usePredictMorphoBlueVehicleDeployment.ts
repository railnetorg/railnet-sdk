'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictMorphoBlueVehicleDeploymentParameters,
  predictMorphoBlueVehicleDeploymentQueryOptions,
} from '../query/predictMorphoBlueVehicleDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictMorphoBlueVehicleDeploymentParameters<
  selectData = QueryData<typeof predictMorphoBlueVehicleDeploymentQueryOptions>,
> = PredictMorphoBlueVehicleDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictMorphoBlueVehicleDeploymentQueryOptions,
    selectData
  >
}

export function usePredictMorphoBlueVehicleDeployment<
  selectData = QueryData<typeof predictMorphoBlueVehicleDeploymentQueryOptions>,
>(parameters: UsePredictMorphoBlueVehicleDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictMorphoBlueVehicleDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
