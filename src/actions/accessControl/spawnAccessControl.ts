import type { Address, Hex } from 'viem'
import { accessControlFactoryAbi } from '../../abi/accessControlFactory.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt: Hex
}

/**
 * Spawns a new ExternalAccessControl via the AccessControlFactory.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link SpawnAccessControlParameters}
 */
export function prepareSpawnAccessControl(parameters: SpawnAccessControlParameters) {
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
