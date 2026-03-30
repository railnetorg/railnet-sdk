import { type Address, type Client, type Hash, type Hex, keccak256, toHex } from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
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
  client: Client,
  parameters: RedeemConduitParameters & { account: Address },
): Promise<Hash> {
  const { conduit, shares, account } = parameters
  const receiver = parameters.receiver ?? account
  const outputAssets = parameters.outputAssets ?? []
  const salt = parameters.salt ?? keccak256(toHex(`redeem-${account}-${Date.now()}`))

  const allowance = await readContract(client, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < shares) {
    const { request: approveRequest } = await simulateContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'approve',
      args: [conduit, shares],
      account,
    })
    const approveHash = await writeContract(client, approveRequest)
    await waitForTransactionReceipt(client, { hash: approveHash })
  }

  const { request: redeemRequest } = await simulateContract(client, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAssets, salt, receiver],
    account,
  })

  return writeContract(client, redeemRequest)
}
