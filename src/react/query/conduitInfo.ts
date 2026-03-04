import type { QueryOptions } from '@tanstack/react-query'
import type { Address, Chain, Client, ReadContractErrorType, Transport } from 'viem'
import { type GetConduitInfoReturnType, getConduitInfo } from '../../actions/getConduitInfo.js'

export type ConduitInfoParameters = {
  conduit: Address
}

export function conduitInfoQueryKey(parameters: ConduitInfoParameters) {
  return ['railnet', 'conduitInfo', parameters] as const
}

export type ConduitInfoQueryKey = ReturnType<typeof conduitInfoQueryKey>

export function conduitInfoQueryOptions<chain extends Chain | undefined>(
  client: Client<Transport, chain> | undefined,
  parameters: ConduitInfoParameters,
) {
  return {
    async queryFn() {
      if (!client) throw new Error('Public client not available')
      return getConduitInfo(client, { conduit: parameters.conduit })
    },
    queryKey: conduitInfoQueryKey(parameters),
  } as const satisfies QueryOptions<
    GetConduitInfoReturnType,
    ReadContractErrorType,
    GetConduitInfoReturnType,
    ConduitInfoQueryKey
  >
}
