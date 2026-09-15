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
 * Viem client decorator adding every Railnet action that only reads. Use with
 * `client.extend(railnetActions)`.
 *
 * Writes are absent by design: the SDK builds calls and the caller sends them, so there is nothing
 * to hang off a client. Reach for the `build*Call` builders and viem's `simulateContract` /
 * `writeContract`.
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
