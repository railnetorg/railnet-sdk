import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export type RevokeScopedRoleReturnType = {
  transactionHash: Hash
}

export async function revokeScopedRole(
  walletClient: WalletClient<Transport, Chain>,
  parameters: RevokeScopedRoleParameters & { account: Address },
): Promise<RevokeScopedRoleReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Revoke scoped role transaction reverted')
  }

  return {
    transactionHash: hash,
  }
}
