'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictOwnerRegistryDeploymentParameters,
  predictOwnerRegistryDeploymentQueryOptions,
} from '../query/predictOwnerRegistryDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictOwnerRegistryDeploymentParameters<
  selectData = QueryData<typeof predictOwnerRegistryDeploymentQueryOptions>,
> = PredictOwnerRegistryDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictOwnerRegistryDeploymentQueryOptions,
    selectData
  >
}

export function usePredictOwnerRegistryDeployment<
  selectData = QueryData<typeof predictOwnerRegistryDeploymentQueryOptions>,
>(parameters: UsePredictOwnerRegistryDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictOwnerRegistryDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
