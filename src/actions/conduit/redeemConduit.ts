import type { Address, Hex } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset } from '../../types.js'

export type BuildRedeemConduitCallParameters = {
  conduit: Address
  shares: bigint
  /**
   * The address that will send the transaction. The conduit burns its shares and derives the query
   * salt from it, so through a Safe, a batch or a relayer this is that contract, not the user.
   */
  sender: Address
  /** The asset to redeem into, from `conduit.asset()`. A zero `value` disables the amount floor. */
  outputAsset: Asset
  /** Caller-chosen entropy. It fixes the query's identity, so it is never generated for you. */
  salt: Hex
  /** Who receives the output asset. Defaults to `sender`. */
  receiver?: Address
}

/**
 * Builds the `conduit.createRedeemFromConduitShares()` call. Needs no approval: the conduit burns
 * the caller's shares through an internal transfer. This entrypoint takes the salt raw and derives
 * the query salt from `(msg.sender, salt)` itself, unlike `conduit.create()`.
 *
 * @param parameters - {@link BuildRedeemConduitCallParameters}
 */
export function buildRedeemConduitCall(parameters: BuildRedeemConduitCallParameters) {
  const { conduit, shares, sender, outputAsset, salt } = parameters

  return {
    address: conduit,
    abi: conduitAbi,
    functionName: 'createRedeemFromConduitShares',
    args: [shares, outputAsset, salt, parameters.receiver ?? sender],
  } as const
}
