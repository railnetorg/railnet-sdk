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
 * Spawns a Conduit via `conduitFactory.spawn(SpawnParams)`. The caller needs CONDUIT_SPAWN, where
 * the other factories gate on FACTORY_SPAWN. The vehicle's asset must be authorized with its
 * {@link getInitialDepositAmount} approved, `initialExpectedSupply` must be non-zero, and every
 * module must come from a trusted factory (`NotDeployedByFactory`). Salts come from {@link
 * randomSalt}; the address from {@link predictConduitDeployment}.
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
