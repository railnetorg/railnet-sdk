import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetMorphoMarketAssetParameters,
  type GetMorphoMarketAssetReturnType,
  getMorphoMarketAsset,
} from '../../actions/vehicle/getMorphoMarketAsset.js'
import { normalizeQueryKeyParameters } from './key.js'

export type MorphoMarketAssetParameters = GetMorphoMarketAssetParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const morphoMarketAssetQueryPrefix = ['railnet', 'morphoMarketAsset'] as const

export function morphoMarketAssetQueryKey(
  chainId: number | undefined,
  parameters: MorphoMarketAssetParameters,
) {
  return [
    ...morphoMarketAssetQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type MorphoMarketAssetQueryKey = ReturnType<typeof morphoMarketAssetQueryKey>

export function morphoMarketAssetQueryOptions(
  client: Client | undefined,
  parameters: MorphoMarketAssetParameters,
) {
  return {
    queryFn: client ? () => getMorphoMarketAsset(client, parameters) : skipToken,
    queryKey: morphoMarketAssetQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetMorphoMarketAssetReturnType,
    ReadContractErrorType,
    GetMorphoMarketAssetReturnType,
    MorphoMarketAssetQueryKey
  >
}
