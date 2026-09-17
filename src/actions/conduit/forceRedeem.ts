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
 * paid to them, without their signature — how a blocked or sanctioned account is off-boarded.
 *
 * It does not complete the exit. `forceRedeem` returns `(queryId, state)`, and against an async
 * vehicle that state is `PROCESSING` when the transaction lands: the shares are burned, the payout
 * has not happened. Read the id with {@link extractQueryIds} and settle it with
 * {@link buildProcessConduitQueryCall}.
 *
 * `accountList.canForceRedeem(user, caller)` gates it, and it takes both sides: `user` has to be
 * sanctioned or block-listed, and the caller has to hold CONDUIT_FORCE_REDEEM globally or scoped to
 * the account list. A clean holder can never be ejected, whatever the caller holds — read
 * {@link getAccountListStatus} first rather than learning it from `ForceRedeemNotAllowed`.
 *
 * The proceeds go to `user`, never to the caller. A conduit with no account list reverts
 * `ForceRedeemUnavailable`, and one not yet enabled reverts `DisabledConduit`.
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
