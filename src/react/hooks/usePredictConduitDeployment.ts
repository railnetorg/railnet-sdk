'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import type { PredictConduitDeploymentParameters } from '../../actions/conduit/predictConduitDeployment.js'
import { attachQueryKey } from '../query/attachQueryKey.js'
import { predictConduitDeploymentQueryOptions } from '../query/predictConduitDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictConduitDeploymentParameters<
  selectData = QueryData<typeof predictConduitDeploymentQueryOptions>,
> = PredictConduitDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`, such as `throwOnError`, `select` or `staleTime`. */
  queryOptions?: QueryOptionsParameter<typeof predictConduitDeploymentQueryOptions, selectData>
}

export function usePredictConduitDeployment<
  selectData = QueryData<typeof predictConduitDeploymentQueryOptions>,
>(parameters: UsePredictConduitDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictConduitDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
