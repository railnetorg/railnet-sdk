import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset } from '../../types.js'

export type ForceRedeemParameters = {
  conduit: Address
  /** The holder being ejected. Must be sanctioned or block-listed, or the call reverts. */
  user: Address
  /** Conduit shares to burn from `user`. Zero reverts `NothingToRedeem`. */
  amount: bigint
  /** The asset `user` is paid in, from `conduit.asset()`. A zero `value` disables the amount floor. */
  outputAsset: Asset
}

/**
 * Builds the `conduit.forceRedeem()` call, which burns a holder's shares and opens a redeem query
 * paid to them. Needs CONDUIT_FORCE_REDEEM, and `user` must be sanctioned or block-listed.
 *
 * Returns `(queryId, state)`. That state is `PROCESSING` against an async vehicle, so the shares
 * are burned before the payout. Settle with {@link buildProcessConduitQueryCall}.
 *
 * @param parameters - {@link ForceRedeemParameters}
 */
export function buildForceRedeemCall(parameters: ForceRedeemParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'forceRedeem',
    args: [parameters.user, parameters.amount, parameters.outputAsset],
  } as const
}
