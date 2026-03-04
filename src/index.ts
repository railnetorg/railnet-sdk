export { conduitAbi } from './abi/conduit.js'
export {
  type GetConduitInfoParameters,
  type GetConduitInfoReturnType,
  getConduitInfo,
} from './actions/getConduitInfo.js'
export {
  type GetConduitPositionParameters,
  type GetConduitPositionReturnType,
  getConduitPosition,
} from './actions/getConduitPosition.js'

export { type RailnetActions, railnetActions } from './decorator.js'

export type { Address, ConduitInfo, ConduitPosition } from './types.js'
