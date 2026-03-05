import { type Address, type Chain, keccak256, type Transport, toHex, type WalletClient } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { RedeemConduitParameters, RedeemConduitReturnType } from './types.js'

export async function redeemConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: RedeemConduitParameters & { account: Address },
): Promise<RedeemConduitReturnType> {
  const { conduit, shares, account } = parameters
  const receiver = parameters.receiver ?? account
  const outputAssets = parameters.outputAssets ?? []
  const salt = parameters.salt ?? keccak256(toHex(`redeem-${account}-${Date.now()}`))

  const allowance = await readContract(walletClient, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < shares) {
    const approveHash = await walletClient.writeContract({
      address: conduit,
      abi: conduitAbi,
      functionName: 'approve',
      args: [conduit, shares],
      account,
      chain: walletClient.chain,
    })

    const approveReceipt = await waitForTransactionReceipt(walletClient, { hash: approveHash })
    if (approveReceipt.status === 'reverted') {
      throw new Error('Conduit share approval transaction reverted')
    }
  }

  const hash = await walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAssets, salt, receiver],
    account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })
  if (receipt.status === 'reverted') {
    throw new Error('Redeem transaction reverted')
  }

  return { transactionHash: hash }
}
