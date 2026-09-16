import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitTransfersParameters = {
  conduit: Address
}

/**
 * A one-way latch: no call turns transfers back off. Reverts `StateUnchanged` when they are
 * already on, and needs CONDUIT_SET_TRANSFER_ENABLED.
 *
 * Not `conduit.enable()`, which takes the ConduitFactory alone and runs once the seed deposit
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
