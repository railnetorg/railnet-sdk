import type { Address, Client, Hash, Hex } from 'viem'
import { readContract, simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'
import { randomSalt } from '../../utils/salt.js'
import type { Asset } from './types.js'

export type RedeemConduitParameters = {
  conduit: Address
  shares: bigint
  receiver?: Address
  outputAsset?: Asset
  salt?: Hex
}

export type PrepareRedeemConduitParameters = Omit<RedeemConduitParameters, 'salt'> & {
  account: Address
  outputAsset: Asset
  salt: Hex
}

export function prepareRedeemConduit(parameters: PrepareRedeemConduitParameters) {
  const { conduit, shares, account, outputAsset, salt: sourceSalt } = parameters
  const receiver = parameters.receiver ?? account

  return {
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    // sourceSalt goes in raw: unlike conduit.create(), this entrypoint derives query.salt from
    // (msg.sender, sourceSalt) itself
    args: [shares, outputAsset, sourceSalt, receiver],
  } as const
}

/**
 * Redeems conduit shares by calling `conduit.createRedeemFromConduitShares()`. On synchronous vehicles the redeem executes immediately. On async vehicles (STEAM) it creates a pending query. Needs no approval: the conduit burns the caller's shares through an internal transfer, so this is a single transaction. Reads `conduit.asset()` to name the query's output asset unless `outputAsset` is supplied.
 *
 * @param parameters - {@link RedeemConduitParameters}
 *
 * @example
 * import { redeemConduit } from '@railnetorg/railnet-sdk'
 *
 * const hash = await redeemConduit(walletClient, {
 *   conduit: conduitAddress,
 *   shares: 500_000n,
 *   account: account.address,
 * })
 */
export async function redeemConduit(
  client: Client,
  parameters: RedeemConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { conduit, account } = parameters

  const outputAsset: Asset = parameters.outputAsset ?? {
    asset: await readContract(client, { address: conduit, abi: conduitAbi, functionName: 'asset' }),
    value: 0n,
  }

  const { request: redeemRequest } = await simulateContract(client, {
    ...options,
    ...prepareRedeemConduit({ ...parameters, outputAsset, salt: parameters.salt ?? randomSalt() }),
    account,
  })

  return writeContract(client, redeemRequest)
}
