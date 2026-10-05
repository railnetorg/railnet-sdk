import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { accessControlFactoryAbi } from '../../abi/accessControlFactory.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt: Hex
}

/**
 * Spawns an ExternalAccessControl via `accessControlFactory.spawn()`. No role gates it.
 *
 * @param parameters - {@link SpawnAccessControlParameters}
 */
export function buildSpawnAccessControlCall(parameters: SpawnAccessControlParameters) {
  const initialDelay = parameters.initialDelay ?? 0
  const initialRoles = parameters.initialRoles ?? []

  return {
    address: parameters.factory,
    abi: accessControlFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        initialDelay,
        initialDefaultAdmin: parameters.initialDefaultAdmin,
        initialRoles,
        deploymentSalt: parameters.deploymentSalt,
      },
    ],
  } as const
}

/**
 * The address {@link buildSpawnAccessControlCall} will deploy to for these parameters, a CREATE2 over
 * every field of the call.
 *
 * @param parameters - {@link SpawnAccessControlParameters}
 */
export async function predictAccessControlDeployment(
  client: Client,
  parameters: SpawnAccessControlParameters,
): Promise<Address> {
  const { address, abi, args } = buildSpawnAccessControlCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddress', args })
}
