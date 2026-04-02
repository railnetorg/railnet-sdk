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

export async function grantScopedRole(
  client: Client,
  parameters: GrantScopedRoleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
  })

  return writeContract(client, request)
}
