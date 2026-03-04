import type { Chain, Client, Transport } from 'viem'
import {
  type GetConduitInfoParameters,
  type GetConduitInfoReturnType,
  getConduitInfo,
} from './actions/getConduitInfo.js'
import {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from './actions/getConduitPosition.js'

export type RailnetActions = {
  getConduitPosition: (
    parameters: GetConduitPositionParameters,
  ) => Promise<GetConduitPositionReturnType>
  getConduitInfo: (parameters: GetConduitInfoParameters) => Promise<GetConduitInfoReturnType>
}

export function railnetActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
>(client: Client<transport, chain>): RailnetActions {
  return {
    getConduitPosition: (args) => getConduitPosition(client, args),
    getConduitInfo: (args) => getConduitInfo(client, args),
  }
}
