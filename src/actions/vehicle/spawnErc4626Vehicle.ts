import { type Address, type Client, type Hex, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { erc4626VehicleFactoryAbi } from '../../abi/erc4626VehicleFactory.js'

export type SpawnErc4626VehicleParameters = {
  factory: Address
  /**
   * The ERC-4626 vault to wrap. The vehicle's asset is the vault's own asset, so none is passed,
   * and the AssetRegistry has to carry an initial deposit amount for it.
   */
  vault: Address
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
 * Spawns a vehicle wrapping any ERC-4626 vault.
 *
 * @param parameters - {@link SpawnErc4626VehicleParameters}
 */
export function buildSpawnErc4626VehicleCall(parameters: SpawnErc4626VehicleParameters) {
  return {
    address: parameters.factory,
    abi: erc4626VehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        vault: parameters.vault,
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
 * The address {@link buildSpawnErc4626VehicleCall} will deploy to for these parameters.
 * The factory names the vehicle after its deployment counter, so the address holds only until the
 * next spawn on the same factory: read it again right before sending, since calls batched after a
 * stale prediction target an address with no code.
 *
 * @param parameters - {@link SpawnErc4626VehicleParameters}
 */
export async function predictErc4626VehicleDeployment(
  client: Client,
  parameters: SpawnErc4626VehicleParameters,
): Promise<Address> {
  const { address, abi, args } = buildSpawnErc4626VehicleCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddress', args })
}
