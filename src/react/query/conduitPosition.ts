import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from '../../actions/conduit/getConduitPosition.js'
import { normalizeQueryKeyValue } from './key.js'

export type ConduitPositionParameters = Omit<GetConduitPositionParameters, 'account'> & {
  account: Address | undefined
}

/** Stable prefix, for `invalidateQueries` across every chain and every parameter set. */
export const conduitPositionQueryPrefix = ['railnet', 'conduitPosition'] as const

export function conduitPositionQueryKey(
  chainId: number | undefined,
  parameters: ConduitPositionParameters,
) {
  return [
    ...conduitPositionQueryPrefix,
    { chainId, ...(normalizeQueryKeyValue(parameters) as ConduitPositionParameters) },
  ] as const
}

export type ConduitPositionQueryKey = ReturnType<typeof conduitPositionQueryKey>

export function conduitPositionQueryOptions(
  client: Client | undefined,
  parameters: ConduitPositionParameters,
) {
  return {
    queryFn:
      client && parameters.account
        ? () =>
            getConduitPosition(client, {
              conduit: parameters.conduit,
              account: parameters.account as Address,
            })
        : skipToken,
    queryKey: conduitPositionQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetConduitPositionReturnType,
    ReadContractErrorType,
    GetConduitPositionReturnType,
    ConduitPositionQueryKey
  >
}
