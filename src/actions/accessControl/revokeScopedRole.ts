import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'
import type { ContractCallOptions } from '../../types.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Revokes a previously granted scoped role from an address. The caller must be the default admin of the access control.
 * @param client - Viem client instance
 * @param parameters - Access control address, role hash, scope (target contract), and grantee address
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function revokeScopedRole(
  client: Client,
  parameters: RevokeScopedRoleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
  })

  return writeContract(client, request)
}
