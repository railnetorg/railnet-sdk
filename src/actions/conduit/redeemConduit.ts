import {
  type Address,
  type Chain,
  type Hash,
  type Hex,
  keccak256,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset } from './types.js'

export type RedeemConduitParameters = {
  conduit: Address
  shares: bigint
  receiver?: Address
  outputAssets?: Asset[]
  salt?: Hex
}

export async function redeemConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: RedeemConduitParameters & { account: Address },
): Promise<Hash> {
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
    await waitForTransactionReceipt(walletClient, { hash: approveHash })
  }

  return walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAssets, salt, receiver],
    account,
    chain: walletClient.chain,
  })
}
