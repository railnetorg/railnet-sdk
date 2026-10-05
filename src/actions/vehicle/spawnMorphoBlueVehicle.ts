import { type Address, type Client, type Hex, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { morphoBlueVehicleFactoryAbi } from '../../abi/morphoBlueVehicleFactory.js'

export type SpawnMorphoBlueVehicleParameters = {
  factory: Address
  /**
   * The Morpho Blue singleton. It must equal the factory implementation's own `MORPHO`; {@link
   * getMorphoBlueSingleton} reads it.
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

/**
 * The address {@link buildSpawnMorphoBlueVehicleCall} will deploy to for these parameters.
 * The factory names the vehicle after its deployment counter, so the address holds only until the
 * next spawn on the same factory: read it again right before sending, since calls batched after a
 * stale prediction target an address with no code.
 *
 * @param parameters - {@link SpawnMorphoBlueVehicleParameters}
 */
export async function predictMorphoBlueVehicleDeployment(
  client: Client,
  parameters: SpawnMorphoBlueVehicleParameters,
): Promise<Address> {
  const { address, abi, args } = buildSpawnMorphoBlueVehicleCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddress', args })
}
