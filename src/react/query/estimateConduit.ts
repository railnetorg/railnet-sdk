'use client'

import type { QueryOptions } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type EstimateConduitParameters,
  type EstimateConduitReturnType,
  estimateConduit,
} from '../../actions/conduit/estimateConduit.js'

export function estimateConduitQueryKey(parameters: EstimateConduitParameters) {
  return ['railnet', 'estimateConduit', parameters] as const
}

export type EstimateConduitQueryKey = ReturnType<typeof estimateConduitQueryKey>

export function estimateConduitQueryOptions(
  client: Client | undefined,
  parameters: EstimateConduitParameters,
) {
  return {
    async queryFn() {
      if (!client) throw new Error('Public client not available')
      return estimateConduit(client, parameters)
    },
    queryKey: estimateConduitQueryKey(parameters),
  } as const satisfies QueryOptions<
    EstimateConduitReturnType,
    ReadContractErrorType,
    EstimateConduitReturnType,
    EstimateConduitQueryKey
  >
}
