import type { Address, Chain, Hash, Hex, PublicClient, Transport, WalletClient } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export async function grantScopedRole(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: GrantScopedRoleParameters & { account: Address },
): Promise<Hash> {
  const { request } = await publicClient.simulateContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
