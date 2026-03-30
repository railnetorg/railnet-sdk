import type { Address, Hash, Hex, PublicClient, WalletClient } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type SetScopedRolePublicParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  isPublic: boolean
}

export async function setScopedRolePublic(
  publicClient: PublicClient,
  walletClient: WalletClient,
  parameters: SetScopedRolePublicParameters & { account: Address },
): Promise<Hash> {
  const { request } = await publicClient.simulateContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'setScopedRolePublic',
    args: [parameters.role, parameters.scope, parameters.isPublic],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
