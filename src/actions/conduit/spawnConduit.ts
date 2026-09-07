import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { SpawnConduitParameters } from './types.js'

/**
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams)`. `querySalt` and `deploymentSalt` are required fields of the spawn params; `deploymentSalt` fixes the conduit's address. Use {@link randomSalt} to generate them.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link SpawnConduitParameters}
 */
export function buildSpawnConduitCall(parameters: SpawnConduitParameters) {
  const spawnParams = {
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

  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [spawnParams],
  } as const
}
