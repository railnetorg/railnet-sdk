import type { QueryOptions } from '@tanstack/react-query'
import type { Address, Chain, Client, ReadContractErrorType, Transport } from 'viem'
import {
  type GetConduitPositionReturnType,
  getConduitPosition,
} from '../../actions/getConduitPosition.js'

export type ConduitPositionParameters = {
  conduit: Address
  account: Address | undefined
}

export function conduitPositionQueryKey(parameters: ConduitPositionParameters) {
  return ['railnet', 'conduitPosition', parameters] as const
}

export type ConduitPositionQueryKey = ReturnType<typeof conduitPositionQueryKey>

export function conduitPositionQueryOptions<chain extends Chain | undefined>(
  client: Client<Transport, chain> | undefined,
  parameters: ConduitPositionParameters,
) {
  return {
    async queryFn() {
      if (!client) throw new Error('Public client not available')
      if (!parameters.account) throw new Error('account is required')
      return getConduitPosition(client, {
        conduit: parameters.conduit,
        account: parameters.account,
      })
    },
    queryKey: conduitPositionQueryKey(parameters),
  } as const satisfies QueryOptions<
    GetConduitPositionReturnType,
    ReadContractErrorType,
    GetConduitPositionReturnType,
    ConduitPositionQueryKey
  >
}
