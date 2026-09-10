import { type Address, type Hex, zeroAddress } from 'viem'
import { wrapperVehicleFactoryAbi } from '../../abi/wrapperVehicleFactory.js'

export type SpawnWrapperVehicleParameters = {
  factory: Address
  /** The token the vehicle wraps one-for-one. */
  asset: Address
  accessControl: Address
  queryRegistry: Address
  feeManager?: Address
  modulesManager?: Address
  forbiddenAddresses?: Address[]
  querySalt: Hex
  deploymentSalt: Hex
}

/**
 * Spawns a wrapper vehicle: it holds the asset itself rather than supplying it anywhere, so it
 * earns nothing and exists to give a plain token a STEAM interface.
 *
 * Unlike the other vehicle factories this one takes no `initialExpectedSupply` — it still pulls a
 * seed deposit from the AssetRegistry, but enforces no floor on the shares minted.
 *
 * @param parameters - {@link SpawnWrapperVehicleParameters}
 */
export function buildSpawnWrapperVehicleCall(parameters: SpawnWrapperVehicleParameters) {
  return {
    address: parameters.factory,
    abi: wrapperVehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        querySalt: parameters.querySalt,
        deploymentSalt: parameters.deploymentSalt,
        forbiddenAddresses: parameters.forbiddenAddresses ?? [],
        queryRegistry: parameters.queryRegistry,
      },
    ],
  } as const
}
