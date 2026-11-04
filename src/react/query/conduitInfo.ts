import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Client, ReadContractErrorType } from 'viem'
import {
  type GetConduitInfoParameters,
  type GetConduitInfoReturnType,
  getConduitInfo,
} from '../../actions/conduit/getConduitInfo.js'
import { normalizeQueryKeyParameters } from './key.js'

export type ConduitInfoParameters = GetConduitInfoParameters

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const conduitInfoQueryPrefix = ['railnet', 'conduitInfo'] as const

export function conduitInfoQueryKey(
  chainId: number | undefined,
  parameters: ConduitInfoParameters,
) {
  return [
    ...conduitInfoQueryPrefix,
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type ConduitInfoQueryKey = ReturnType<typeof conduitInfoQueryKey>

export function conduitInfoQueryOptions(
  client: Client | undefined,
  parameters: ConduitInfoParameters,
) {
  return {
    queryFn: client ? () => getConduitInfo(client, parameters) : skipToken,
    queryKey: conduitInfoQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetConduitInfoReturnType,
    ReadContractErrorType,
    GetConduitInfoReturnType,
    ConduitInfoQueryKey
  >
}
