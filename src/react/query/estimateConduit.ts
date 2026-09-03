'use client'

import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type EstimateConduitParameters,
  type EstimateConduitReturnType,
  estimateConduit,
} from '../../actions/conduit/estimateConduit.js'
import { normalizeQueryKeyValue } from './key.js'

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const estimateConduitQueryPrefix = ['railnet', 'estimateConduit'] as const

export function estimateConduitQueryKey(
  chainId: number | undefined,
  parameters: EstimateConduitParameters,
) {
  return [
    ...estimateConduitQueryPrefix,
    { chainId, ...(normalizeQueryKeyValue(parameters) as EstimateConduitParameters) },
  ] as const
}

export type EstimateConduitQueryKey = ReturnType<typeof estimateConduitQueryKey>

export function estimateConduitQueryOptions(
  client: Client | undefined,
  parameters: EstimateConduitParameters,
) {
  return {
    queryFn: client ? () => estimateConduit(client, parameters) : skipToken,
    queryKey: estimateConduitQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    EstimateConduitReturnType,
    ReadContractErrorType,
    EstimateConduitReturnType,
    EstimateConduitQueryKey
  >
}
