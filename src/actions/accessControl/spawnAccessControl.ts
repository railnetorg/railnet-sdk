import { type Address, type Client, type Hash, type Hex, keccak256, toHex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { accessControlFactoryAbi } from '../../abi/accessControlFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt?: Hex
}

export function prepareSpawnAccessControl(parameters: SpawnAccessControlParameters) {
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`access-control-${Date.now()}`))
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
        deploymentSalt,
      },
    ],
  } as const
}

/**
 * Spawns a new ExternalAccessControl via the AccessControlFactory.
 * Use {@link extractAccessControlAddress} to extract the deployed address from the transaction receipt.
 * @param client - Viem client instance
 * @param parameters - Factory address, initial admin, optional delay, initial roles, and deployment salt
 * @param options - Optional contract call overrides
 * @returns Transaction hash of the spawn
 */
export async function spawnAccessControl(
  client: Client,
  parameters: SpawnAccessControlParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSpawnAccessControl(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
