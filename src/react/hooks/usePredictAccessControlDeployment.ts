'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type PredictAccessControlDeploymentParameters,
  predictAccessControlDeploymentQueryOptions,
} from '../query/predictAccessControlDeployment.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UsePredictAccessControlDeploymentParameters<
  selectData = QueryData<typeof predictAccessControlDeploymentQueryOptions>,
> = PredictAccessControlDeploymentParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<
    typeof predictAccessControlDeploymentQueryOptions,
    selectData
  >
}

export function usePredictAccessControlDeployment<
  selectData = QueryData<typeof predictAccessControlDeploymentQueryOptions>,
>(parameters: UsePredictAccessControlDeploymentParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = predictAccessControlDeploymentQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
