import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitTransfersParameters = {
  conduit: Address
}

/**
 * Turns on conduit share transfers. A one-way latch: there is no call that turns them back off,
 * so an ERC-20 integration built on top cannot be bricked. Reverts `StateUnchanged` when they are
 * already on. The caller needs CONDUIT_SET_TRANSFER_ENABLED.
 *
 * This does not enable the conduit itself — `conduit.enable()` only accepts the ConduitFactory,
 * which calls it once the seed deposit settles and the expected supply is reached.
 *
 * @param parameters - {@link EnableConduitTransfersParameters}
 */
export function buildEnableConduitTransfersCall(parameters: EnableConduitTransfersParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enableTransfers',
    args: [],
  } as const
}
