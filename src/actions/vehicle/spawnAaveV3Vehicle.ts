import { type Address, type Client, type Hex, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { aaveV3VehicleFactoryAbi } from '../../abi/aaveV3VehicleFactory.js'

export type SpawnAaveV3VehicleParameters = {
  factory: Address
  asset: Address
  poolAddressesProvider: Address
  accessControl: Address
  queryRegistry: Address
  feeManager?: Address
  modulesManager?: Address
  forbiddenAddresses?: Address[]
  initialExpectedSupply: bigint
  querySalt: Hex
  deploymentSalt: Hex
}

/**
 * Spawns an Aave V3 vehicle via `aaveV3VehicleFactory.spawn()`. Needs FACTORY_SPAWN; the factory
 * pulls the asset's initial deposit from the caller.
 *
 * @param parameters - {@link SpawnAaveV3VehicleParameters}
 */
export function buildSpawnAaveV3VehicleCall(parameters: SpawnAaveV3VehicleParameters) {
  return {
    address: parameters.factory,
    abi: aaveV3VehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        poolAddressesProvider: parameters.poolAddressesProvider,
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
 * The address {@link buildSpawnAaveV3VehicleCall} will deploy to for these parameters.
 * The factory names the vehicle after its deployment counter, so the address holds only until the
 * next spawn on the same factory: read it again right before sending, since calls batched after a
 * stale prediction target an address with no code.
 *
 * @param parameters - {@link SpawnAaveV3VehicleParameters}
 */
export async function predictAaveV3VehicleDeployment(
  client: Client,
  parameters: SpawnAaveV3VehicleParameters,
): Promise<Address> {
  const { address, abi, args } = buildSpawnAaveV3VehicleCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddress', args })
}
