import type { Client } from 'viem'
import { getHasRole } from './actions/accessControl/getHasRole.js'
import { getAccountListStatus } from './actions/accountList/getAccountListStatus.js'
import { predictAccountListDeployment } from './actions/accountList/spawnAccountList.js'
import { getInitialDepositAmount } from './actions/assetRegistry/getInitialDepositAmount.js'
import { estimateConduit } from './actions/conduit/estimateConduit.js'
import { getConduitInfo } from './actions/conduit/getConduitInfo.js'
import { getConduitPosition } from './actions/conduit/getConduitPosition.js'
import { getDepositConduitCall } from './actions/conduit/getDepositConduitCall.js'
import { getIsTransferable } from './actions/conduit/getIsTransferable.js'
import { getRedeemConduitCall } from './actions/conduit/getRedeemConduitCall.js'
import { predictConduitDeployment } from './actions/conduit/predictConduitDeployment.js'
import { predictFeeManagerDeployment } from './actions/feeManager/spawnFeeManager.js'
import { simulateDispatchVehicle } from './actions/multiVehicle/dispatchVehicle.js'
import { getSectorBalance } from './actions/multiVehicle/getSectorBalance.js'
import { getVehicleManagerLimits } from './actions/multiVehicle/getVehicleManagerLimits.js'
import { predictOwnerRegistryDeployment } from './actions/ownerRegistry/spawnOwnerRegistry.js'
import { getQueryClaim } from './actions/ownerRegistry/wrapQuery.js'
import { estimateVehicle } from './actions/vehicle/estimateVehicle.js'
import { getMorphoBlueSingleton } from './actions/vehicle/getMorphoBlueSingleton.js'
import { getMorphoMarketAsset } from './actions/vehicle/getMorphoMarketAsset.js'

/**
 * Viem client decorator adding every Railnet read action, for `client.extend(railnetActions)`.
 * Writes are calls the `build*Call` builders return and the caller sends with viem's
 * `simulateContract` and `writeContract`.
 */
export function railnetActions(client: Client) {
  const bind =
    <parameters, returnType>(action: (client: Client, parameters: parameters) => returnType) =>
    (parameters: parameters): returnType =>
      action(client, parameters)

  return {
    estimateConduit: bind(estimateConduit),
    getAccountListStatus: bind(getAccountListStatus),
    estimateVehicle: bind(estimateVehicle),
    getConduitInfo: bind(getConduitInfo),
    getConduitPosition: bind(getConduitPosition),
    getDepositConduitCall: bind(getDepositConduitCall),
    getHasRole: bind(getHasRole),
    getInitialDepositAmount: bind(getInitialDepositAmount),
    getMorphoBlueSingleton: bind(getMorphoBlueSingleton),
    getMorphoMarketAsset: bind(getMorphoMarketAsset),
    getQueryClaim: bind(getQueryClaim),
    getRedeemConduitCall: bind(getRedeemConduitCall),
    getSectorBalance: bind(getSectorBalance),
    getIsTransferable: bind(getIsTransferable),
    getVehicleManagerLimits: bind(getVehicleManagerLimits),
    predictAccountListDeployment: bind(predictAccountListDeployment),
    predictConduitDeployment: bind(predictConduitDeployment),
    predictFeeManagerDeployment: bind(predictFeeManagerDeployment),
    predictOwnerRegistryDeployment: bind(predictOwnerRegistryDeployment),
    simulateDispatchVehicle: bind(simulateDispatchVehicle),
  }
}

export type RailnetActions = ReturnType<typeof railnetActions>
