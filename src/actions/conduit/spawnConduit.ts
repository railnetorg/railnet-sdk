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
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams)`. The caller needs CONDUIT_SPAWN on
 * the factory's access control — not FACTORY_SPAWN, which gates the other factories.
 *
 * `vehicle`'s asset must be authorized in the AssetRegistry, with its initial deposit amount
 * approved to the factory by the caller; read it with {@link getInitialDepositAmount}.
 * `feeManager`, `accountList`, `ownerRegistry` and `accessControl` must each have been spawned by
 * the factory this one trusts for that module, or the call reverts `NotDeployedByFactory`.
 * `initialExpectedSupply` must be non-zero.
 *
 * `querySalt` and `deploymentSalt` are required fields of the spawn params; use {@link randomSalt}
 * to generate them. The address is a CREATE2 of the proxy's init code, so every module and metadata
 * field moves it, not `deploymentSalt` alone — predict it with {@link predictConduitDeployment}.
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
