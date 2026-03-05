import type { Address, Chain, Client, Transport } from 'viem'
import { estimateConduit } from './actions/conduit/estimateConduit.js'
import {
  type GetConduitInfoParameters,
  type GetConduitInfoReturnType,
  getConduitInfo,
} from './actions/conduit/getConduitInfo.js'
import {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from './actions/conduit/getConduitPosition.js'
import {
  type PredictConduitDeploymentParameters,
  predictConduitDeployment,
} from './actions/conduit/predictConduitDeployment.js'
import type { Asset, EstimateConduitParameters } from './actions/conduit/types.js'

export type RailnetActions = {
  getConduitPosition: (
    parameters: GetConduitPositionParameters,
  ) => Promise<GetConduitPositionReturnType>
  getConduitInfo: (parameters: GetConduitInfoParameters) => Promise<GetConduitInfoReturnType>
  predictConduitDeployment: (parameters: PredictConduitDeploymentParameters) => Promise<Address>
  estimateConduit: (parameters: EstimateConduitParameters) => Promise<Asset[]>
}

export function railnetActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
>(client: Client<transport, chain>): RailnetActions {
  return {
    getConduitPosition: (args) => getConduitPosition(client, args),
    getConduitInfo: (args) => getConduitInfo(client, args),
    predictConduitDeployment: (args) => predictConduitDeployment(client, args),
    estimateConduit: (args) => estimateConduit(client, args),
  }
}
