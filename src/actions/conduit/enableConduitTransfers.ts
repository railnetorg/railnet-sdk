import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitTransfersParameters = {
  conduit: Address
}

/**
 * Turns on transfers of a conduit's shares; no call turns them back off. Needs
 * CONDUIT_SET_TRANSFER_ENABLED and reverts `StateUnchanged` when they are already on.
 * `conduit.enable()` is a different call, sent by the ConduitFactory alone once the seed deposit
 * settles.
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
