import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export type GrantScopedRoleReturnType = {
  transactionHash: Hash
}

export async function grantScopedRole(
  walletClient: WalletClient<Transport, Chain>,
  parameters: GrantScopedRoleParameters & { account: Address },
): Promise<GrantScopedRoleReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Grant scoped role transaction reverted')
  }

  return {
    transactionHash: hash,
  }
}
