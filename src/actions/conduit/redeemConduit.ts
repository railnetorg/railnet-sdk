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
  outputAsset?: Asset
  salt?: Hex
}

export type PrepareRedeemConduitParameters = RedeemConduitParameters & {
  account: Address
  outputAsset: Asset
}

export function prepareRedeemConduit(parameters: PrepareRedeemConduitParameters) {
  const { conduit, shares, account, outputAsset } = parameters
  const receiver = parameters.receiver ?? account
  // createRedeemFromConduitShares() derives query.salt from (msg.sender, sourceSalt) itself
  const sourceSalt = parameters.salt ?? keccak256(toHex(`redeem-${account}-${Date.now()}`))

  return {
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAsset, sourceSalt, receiver],
  } as const
}

/**
 * Redeems conduit shares by calling `conduit.createRedeemFromConduitShares()`. On synchronous vehicles the redeem executes immediately. On async vehicles (STEAM) it creates a pending query. Automatically approves conduit shares if the current allowance is insufficient, and reads `conduit.asset()` to name the query's output asset unless `outputAsset` is supplied.
 * @param client - Viem client instance
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function redeemConduit(
  client: Client,
  parameters: RedeemConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { conduit, shares, account } = parameters

  const [allowance, outputAsset] = await Promise.all([
    readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'allowance',
      args: [account, conduit],
    }),
    parameters.outputAsset ??
      readContract(client, { address: conduit, abi: conduitAbi, functionName: 'asset' }).then(
        (asset) => ({ asset, value: 0n }),
      ),
  ])

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
    ...prepareRedeemConduit({ ...parameters, outputAsset }),
    account,
  })

  return writeContract(client, redeemRequest)
}
