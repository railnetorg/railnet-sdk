import { type QueryOptions, skipToken } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from '../../actions/conduit/getConduitPosition.js'
import { normalizeQueryKeyParameters } from './key.js'

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
    { ...normalizeQueryKeyParameters(parameters), chainId },
  ] as const
}

export type ConduitPositionQueryKey = ReturnType<typeof conduitPositionQueryKey>

export function conduitPositionQueryOptions(
  client: Client | undefined,
  parameters: ConduitPositionParameters,
) {
  const { account } = parameters

  return {
    queryFn:
      client && account ? () => getConduitPosition(client, { ...parameters, account }) : skipToken,
    queryKey: conduitPositionQueryKey(client?.chain?.id, parameters),
  } as const satisfies QueryOptions<
    GetConduitPositionReturnType,
    ReadContractErrorType,
    GetConduitPositionReturnType,
    ConduitPositionQueryKey
  >
}
