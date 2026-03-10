import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export async function grantScopedRole(
  walletClient: WalletClient<Transport, Chain>,
  parameters: GrantScopedRoleParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
