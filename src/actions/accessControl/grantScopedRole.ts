import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'
import type { ContractCallOptions } from '../../types.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export function prepareGrantScopedRole(parameters: GrantScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
  } as const
}

/**
 * Grants a role to an address, scoped to a specific contract. The caller must be the default admin of the access control.
 * @param client - Viem client instance
 * @param parameters - Access control address, role hash, scope (target contract), and grantee address
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function grantScopedRole(
  client: Client,
  parameters: GrantScopedRoleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareGrantScopedRole(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
