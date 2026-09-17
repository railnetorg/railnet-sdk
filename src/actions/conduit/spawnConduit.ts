import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { SpawnConduitParameters } from './types.js'

/** The `SpawnParams` tuple the factory takes, in its declared field order. */
export function toConduitSpawnParams(parameters: SpawnConduitParameters) {
  return {
    name: parameters.name,
    symbol: parameters.symbol,
    vehicle: parameters.vehicle,
    feeManager: parameters.feeManager,
    accountList: parameters.accountList,
    ownerRegistry: parameters.ownerRegistry,
    accessControl: parameters.accessControl,
    transferEnabled: parameters.transferEnabled,
    initialInterceptions: parameters.initialInterceptions ?? [],
    initialExpectedSupply: parameters.initialExpectedSupply,
    querySalt: parameters.querySalt,
    deploymentSalt: parameters.deploymentSalt,
  } as const
}

/**
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams)`. The caller needs CONDUIT_SPAWN —
 * not the FACTORY_SPAWN that gates the other factories.
 *
 * `vehicle`'s asset must be authorized in the AssetRegistry with its
 * {@link getInitialDepositAmount} approved to the factory, `initialExpectedSupply` must be
 * non-zero, and every module must come from the factory this one trusts for it
 * (`NotDeployedByFactory`).
 *
 * `querySalt` and `deploymentSalt` are required fields of the spawn params; use {@link randomSalt}.
 * The address is a CREATE2 of the proxy's init code, so every module and metadata field moves it —
 * resolve it with {@link predictConduitDeployment}.
 *
 * @param parameters - {@link SpawnConduitParameters}
 */
export function buildSpawnConduitCall(parameters: SpawnConduitParameters) {
  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [toConduitSpawnParams(parameters)],
  } as const
}
