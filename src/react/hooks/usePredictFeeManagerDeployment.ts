'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictFeeManagerDeploymentParameters,
  predictFeeManagerDeploymentQueryOptions,
} from '../query/predictFeeManagerDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictFeeManagerDeploymentParameters<
  selectData = QueryData<typeof predictFeeManagerDeploymentQueryOptions>,
> = PredictFeeManagerDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof predictFeeManagerDeploymentQueryOptions, selectData>
}

export function usePredictFeeManagerDeployment<
  selectData = QueryData<typeof predictFeeManagerDeploymentQueryOptions>,
>(parameters: UsePredictFeeManagerDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictFeeManagerDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
