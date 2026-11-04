'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { attachQueryKey } from '../query/attachQueryKey.js'
import {
  type MultiVehiclePositionsParameters,
  multiVehiclePositionsQueryOptions,
} from '../query/multiVehiclePositions.js'
import type { QueryData, QueryOptionsParameter } from '../query/queryOptionsParameter.js'

export type UseMultiVehiclePositionsParameters<
  selectData = QueryData<typeof multiVehiclePositionsQueryOptions>,
> = MultiVehiclePositionsParameters & {
  /** Chain to read from. Defaults to the connected one. */
  chainId?: number
  enabled?: boolean
  /** Forwarded to `useQuery`. */
  queryOptions?: QueryOptionsParameter<typeof multiVehiclePositionsQueryOptions, selectData>
}

export function useMultiVehiclePositions<
  selectData = QueryData<typeof multiVehiclePositionsQueryOptions>,
>(parameters: UseMultiVehiclePositionsParameters<selectData>) {
  const { enabled = true, chainId, queryOptions, ...queryParameters } = parameters
  const client = usePublicClient({ chainId })
  const options = multiVehiclePositionsQueryOptions(client, queryParameters)

  const result = useQuery({
    ...queryOptions,
    ...options,
    enabled,
  })

  return attachQueryKey(result, options.queryKey)
}
