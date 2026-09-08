import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitParameters = {
  conduit: Address
}

/**
 * Enables a conduit, transitioning it to an operational state. Can only be called by the conduit factory.
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
