import type { QueryOptions } from '@tanstack/react-query'
import type { Address, Client, ReadContractErrorType } from 'viem'
import {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from '../../actions/conduit/getConduitPosition.js'

export type ConduitPositionParameters = Omit<GetConduitPositionParameters, 'account'> & {
  account: Address | undefined
}

export function conduitPositionQueryKey(parameters: ConduitPositionParameters) {
  return ['railnet', 'conduitPosition', parameters] as const
}

export type ConduitPositionQueryKey = ReturnType<typeof conduitPositionQueryKey>

export function conduitPositionQueryOptions(
  client: Client | undefined,
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
