import { type Address, type Client, type Hash, type Hex, keccak256, toHex } from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'
import type { Asset } from './types.js'

export type RedeemConduitParameters = {
  conduit: Address
  shares: bigint
  receiver?: Address
  outputAssets?: Asset[]
  salt?: Hex
}

export type PrepareRedeemConduitParameters = RedeemConduitParameters & {
  account: Address
}

export function prepareRedeemConduit(parameters: PrepareRedeemConduitParameters) {
  const { conduit, shares, account } = parameters
  const receiver = parameters.receiver ?? account
  const outputAssets = parameters.outputAssets ?? []
  // createRedeemFromConduitShares() derives query.salt from (msg.sender, sourceSalt) itself
  const sourceSalt = parameters.salt ?? keccak256(toHex(`redeem-${account}-${Date.now()}`))

  return {
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAssets, sourceSalt, receiver],
  } as const
}

/**
 * Redeems conduit shares by calling `conduit.createRedeemFromConduitShares()`. On synchronous vehicles the redeem executes immediately. On async vehicles (STEAM) it creates a pending query. Automatically approves conduit shares if the current allowance is insufficient.
 * @param client - Viem client instance
 * @param parameters - Conduit address, shares amount. Optional: receiver (defaults to caller), outputAssets (Asset[]), salt (auto-generated)
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function redeemConduit(
  client: Client,
  parameters: RedeemConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { conduit, shares, account } = parameters

  const allowance = await readContract(client, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < shares) {
    const { request: approveRequest } = await simulateContract(client, {
      ...options,
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
    ...options,
    ...prepareRedeemConduit(parameters),
    account,
  })

  return writeContract(client, redeemRequest)
}
