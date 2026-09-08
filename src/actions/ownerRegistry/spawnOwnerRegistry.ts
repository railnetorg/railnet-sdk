import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { ownerRegistryFactoryAbi } from '../../abi/ownerRegistryFactory.js'

export type SpawnOwnerRegistryParameters = {
  factory: Address
  /** ERC-721 name, shown wherever a wrapped query claim is held. */
  name: string
  symbol: string
  deploymentSalt: Hex
}

function toSpawnParams(parameters: SpawnOwnerRegistryParameters) {
  return {
    symbol: parameters.symbol,
    name: parameters.name,
    deploymentSalt: parameters.deploymentSalt,
  } as const
}

/**
 * Spawns an OwnerRegistry, the ERC-721 registry that records who owns a conduit's live queries and
 * lets an owner wrap that claim into a transferable token. It carries no access control of its
 * own; the caller needs FACTORY_SPAWN on the factory's.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link SpawnOwnerRegistryParameters}
 */
export function buildSpawnOwnerRegistryCall(parameters: SpawnOwnerRegistryParameters) {
  return {
    address: parameters.factory,
    abi: ownerRegistryFactoryAbi,
    functionName: 'spawn',
    args: [toSpawnParams(parameters)],
  } as const
}

/**
 * The address {@link buildSpawnOwnerRegistryCall} will deploy to for these parameters.
 *
 * @param parameters - {@link SpawnOwnerRegistryParameters}
 */
export async function predictOwnerRegistryDeployment(
  client: Client,
  parameters: SpawnOwnerRegistryParameters,
): Promise<Address> {
  return readContract(client, {
    address: parameters.factory,
    abi: ownerRegistryFactoryAbi,
    functionName: 'getDeploymentAddress',
    args: [toSpawnParams(parameters)],
  })
}
