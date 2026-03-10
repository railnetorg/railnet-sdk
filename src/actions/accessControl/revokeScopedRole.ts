import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export async function revokeScopedRole(
  walletClient: WalletClient<Transport, Chain>,
  parameters: RevokeScopedRoleParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
