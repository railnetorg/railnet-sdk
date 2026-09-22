import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

/** @deprecated Removed in 0.9.0. See {@link buildEnableConduitCall}. */
export type EnableConduitParameters = {
  conduit: Address
}

/**
 * Builds `conduit.enable()`. The ConduitFactory alone may send it, once the seed deposit settles;
 * any other sender reverts `InvalidCaller`.
 *
 * @deprecated Unusable outside the factory, and removed in 0.9.0. To let holders transfer their
 * shares — what this was reached for — use {@link buildEnableConduitTransfersCall}, which builds
 * `conduit.enableTransfers()`, a different call.
 *
 * @param parameters - {@link EnableConduitParameters}
 */
export function buildEnableConduitCall(parameters: EnableConduitParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
  } as const
}
