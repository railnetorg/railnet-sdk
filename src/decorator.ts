import type { Address, Client } from 'viem'
import type { EstimateConduitParameters } from './actions/conduit/estimateConduit.js'
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
import type { Asset } from './actions/conduit/types.js'

export type RailnetActions = {
  getConduitPosition: (
    parameters: GetConduitPositionParameters,
  ) => Promise<GetConduitPositionReturnType>
  getConduitInfo: (parameters: GetConduitInfoParameters) => Promise<GetConduitInfoReturnType>
  predictConduitDeployment: (parameters: PredictConduitDeploymentParameters) => Promise<Address>
  estimateConduit: (parameters: EstimateConduitParameters) => Promise<Asset>
}

/**
 * Viem client decorator that adds Railnet read actions. Use with `client.extend(railnetActions)`.
 */
export function railnetActions(client: Client): RailnetActions {
  return {
    getConduitPosition: (args) => getConduitPosition(client, args),
    getConduitInfo: (args) => getConduitInfo(client, args),
    predictConduitDeployment: (args) => predictConduitDeployment(client, args),
    estimateConduit: (args) => estimateConduit(client, args),
  }
}
