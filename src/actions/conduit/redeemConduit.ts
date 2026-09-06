import type { Address, Hex } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
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

/**
 * Redeems conduit shares by calling `conduit.createRedeemFromConduitShares()`. On synchronous vehicles the redeem executes immediately. On async vehicles (STEAM) it creates a pending query. Needs no approval: the conduit burns the caller's shares through an internal transfer, so this is a single transaction. Reads `conduit.asset()` to name the query's output asset unless `outputAsset` is supplied.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link RedeemConduitParameters}
 */
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
