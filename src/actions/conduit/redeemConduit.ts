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
 * Builds the `conduit.createRedeemFromConduitShares()` call. Needs no approval: the conduit burns
 * the caller's shares through an internal transfer. This entrypoint derives the query salt from
 * `(msg.sender, salt)` itself, unlike `conduit.create()`.
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
