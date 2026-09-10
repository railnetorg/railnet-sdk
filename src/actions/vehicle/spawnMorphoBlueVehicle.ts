import { type Address, type Hex, zeroAddress } from 'viem'
import { morphoBlueVehicleFactoryAbi } from '../../abi/morphoBlueVehicleFactory.js'

export type SpawnMorphoBlueVehicleParameters = {
  factory: Address
  /**
   * The Morpho Blue singleton. It must equal the factory implementation's own `MORPHO` — read it
   * with {@link getMorphoBlueSingleton} rather than supplying it by hand.
   */
  morpho: Address
  /** Morpho Blue market id (`Id`, a bytes32). Decides the asset, so none is passed. */
  marketId: Hex
  accessControl: Address
  queryRegistry: Address
  feeManager?: Address
  modulesManager?: Address
  forbiddenAddresses?: Address[]
  /** Floor on the shares the seed deposit must mint. The factory rejects zero. */
  initialExpectedSupply: bigint
  querySalt: Hex
  deploymentSalt: Hex
}

/**
 * Spawns a vehicle supplying into one Morpho Blue market.
 *
 * @param parameters - {@link SpawnMorphoBlueVehicleParameters}
 */
export function buildSpawnMorphoBlueVehicleCall(parameters: SpawnMorphoBlueVehicleParameters) {
  return {
    address: parameters.factory,
    abi: morphoBlueVehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        morpho: parameters.morpho,
        marketId: parameters.marketId,
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        querySalt: parameters.querySalt,
        deploymentSalt: parameters.deploymentSalt,
        forbiddenAddresses: parameters.forbiddenAddresses ?? [],
        initialExpectedSupply: parameters.initialExpectedSupply,
        queryRegistry: parameters.queryRegistry,
      },
    ],
  } as const
}
