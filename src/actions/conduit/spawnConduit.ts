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
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams)`. `querySalt` and `deploymentSalt` are required fields of the spawn params; `deploymentSalt` fixes the conduit's address. Use {@link randomSalt} to generate them.
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
