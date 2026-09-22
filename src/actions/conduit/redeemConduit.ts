import type { Address, Hex } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset } from '../../types.js'

export type BuildRedeemConduitCallParameters = {
  conduit: Address
  shares: bigint
  /**
   * The address that will send the transaction. The conduit derives the query salt from
   * `msg.sender`; through a Safe, a batch or a relayer that is the contract.
   */
  sender: Address
  /** The asset to redeem into, from `conduit.asset()`. A zero `value` disables the amount floor. */
  outputAsset: Asset
  /**
   * Caller-chosen entropy that fixes the query's identity. Use {@link randomSalt} and keep it for
   * the whole operation.
   */
  salt: Hex
  /** Who receives the output asset. Defaults to `sender`. */
  receiver?: Address
}

/**
 * Builds the `conduit.createRedeemFromConduitShares()` call. It needs no approval; the conduit
 * burns the caller's shares. The conduit derives the query salt from `(msg.sender, salt)` itself.
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
