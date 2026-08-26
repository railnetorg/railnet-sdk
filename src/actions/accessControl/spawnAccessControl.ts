import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { accessControlFactoryAbi } from '../../abi/accessControlFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt: Hex
}

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

/**
 * Spawns a new ExternalAccessControl via the AccessControlFactory.
 * Use {@link extractAccessControlAddress} to extract the deployed address from the transaction receipt.
 *
 * @param parameters - {@link SpawnAccessControlParameters}
 *
 * @example
 * import { extractAccessControlAddress, getAddresses, spawnAccessControl } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { eacFactory } = getAddresses(base.id)
 *
 * const hash = await spawnAccessControl(walletClient, {
 *   factory: eacFactory,
 *   initialDefaultAdmin: account.address,
 *   account: account.address,
 * })
 * const receipt = await publicClient.waitForTransactionReceipt({ hash })
 * const eacAddress = extractAccessControlAddress(receipt, eacFactory)
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
