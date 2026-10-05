import { type Address, type Client, type Hex, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
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
 * Spawns a wrapper vehicle, which holds its asset and earns nothing; it gives a plain token a
 * STEAM interface. It takes no `initialExpectedSupply`, pulls the seed deposit, and enforces no
 * floor on the shares minted.
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

/**
 * The address {@link buildSpawnWrapperVehicleCall} will deploy to for these parameters.
 * The factory names the vehicle after its deployment counter, so the address holds only until the
 * next spawn on the same factory: read it again right before sending, since calls batched after a
 * stale prediction target an address with no code.
 *
 * @param parameters - {@link SpawnWrapperVehicleParameters}
 */
export async function predictWrapperVehicleDeployment(
  client: Client,
  parameters: SpawnWrapperVehicleParameters,
): Promise<Address> {
  const { address, abi, args } = buildSpawnWrapperVehicleCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddress', args })
}
