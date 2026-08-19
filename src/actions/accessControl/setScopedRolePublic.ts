import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'
import type { ContractCallOptions } from '../../types.js'

export type SetScopedRolePublicParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  isPublic: boolean
}

export function prepareSetScopedRolePublic(parameters: SetScopedRolePublicParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'setScopedRolePublic',
    args: [parameters.role, parameters.scope, parameters.isPublic],
  } as const
}

/**
 * Sets whether a scoped role is public (callable by any address) or restricted. The caller must be the default admin.
 * @param client - Viem client instance
 * @param parameters - Access control address, role hash, scope, and isPublic flag
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function setScopedRolePublic(
  client: Client,
  parameters: SetScopedRolePublicParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSetScopedRolePublic(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
