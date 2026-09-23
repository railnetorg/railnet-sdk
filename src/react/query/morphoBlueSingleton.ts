import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetMorphoBlueSingletonParameters,
  type GetMorphoBlueSingletonReturnType,
  getMorphoBlueSingleton,
} from '../../actions/vehicle/getMorphoBlueSingleton.js'
import { normalizeQueryKeyParameters } from './key.js'

export type MorphoBlueSingletonParameters = GetMorphoBlueSingletonParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const morphoBlueSingletonQueryPrefix = ['railnet', 'morphoBlueSingleton'] as const

export function morphoBlueSingletonQueryKey(
  chainId: number | undefined,
  parameters: MorphoBlueSingletonParameters,
) {
  return [
    ...morphoBlueSingletonQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type MorphoBlueSingletonQueryKey = ReturnType<typeof morphoBlueSingletonQueryKey>

export function morphoBlueSingletonQueryOptions(
  client: Client | undefined,
  parameters: MorphoBlueSingletonParameters,
) {
  return {
    queryFn: client ? () => getMorphoBlueSingleton(client, parameters) : skipToken,
    queryKey: morphoBlueSingletonQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetMorphoBlueSingletonReturnType,
    ReadContractErrorType,
    GetMorphoBlueSingletonReturnType,
    MorphoBlueSingletonQueryKey
  >
}
