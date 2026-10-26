'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictAccountListDeploymentParameters,
  predictAccountListDeploymentQueryOptions,
} from '../query/predictAccountListDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictAccountListDeploymentParameters<
  selectData = QueryData<typeof predictAccountListDeploymentQueryOptions>,
> = PredictAccountListDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof predictAccountListDeploymentQueryOptions, selectData>
}

export function usePredictAccountListDeployment<
  selectData = QueryData<typeof predictAccountListDeploymentQueryOptions>,
>(parameters: UsePredictAccountListDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictAccountListDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
