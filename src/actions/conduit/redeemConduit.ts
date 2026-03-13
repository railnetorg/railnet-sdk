import {
  type Address,
  type Chain,
  type Hash,
  type Hex,
  keccak256,
  type PublicClient,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
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
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: RedeemConduitParameters & { account: Address },
): Promise<Hash> {
  const { conduit, shares, account } = parameters
  const receiver = parameters.receiver ?? account
  const outputAssets = parameters.outputAssets ?? []
  const salt = parameters.salt ?? keccak256(toHex(`redeem-${account}-${Date.now()}`))

  const allowance = await publicClient.readContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < shares) {
    const { request: approveRequest } = await publicClient.simulateContract({
      address: conduit,
      abi: conduitAbi,
      functionName: 'approve',
      args: [conduit, shares],
      account,
    })
    const approveHash = await walletClient.writeContract(approveRequest)
    await publicClient.waitForTransactionReceipt({ hash: approveHash })
  }

  const { request: redeemRequest } = await publicClient.simulateContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAssets, salt, receiver],
    account,
  })

  return walletClient.writeContract(redeemRequest)
}
