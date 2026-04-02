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

export async function setScopedRolePublic(
  client: Client,
  parameters: SetScopedRolePublicParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'setScopedRolePublic',
    args: [parameters.role, parameters.scope, parameters.isPublic],
    account: parameters.account,
  })

  return writeContract(client, request)
}
