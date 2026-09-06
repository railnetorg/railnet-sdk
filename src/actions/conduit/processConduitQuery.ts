import type { Address } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import { prepareDepositConduit } from './depositConduit.js'
import type { Query } from './types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: Query
}

/** Returns the {@link Query} a DEPOSIT query would create, for later `process()` on async vehicles. */
export function prepareDepositConduitQuery(
  parameters: Parameters<typeof prepareDepositConduit>[0],
): Query {
  return prepareDepositConduit(parameters).args[0]
}

/**
 * Processes a query on a conduit by calling `conduit.process()`, advancing its state. Used for async (STEAM) vehicles where queries go through multiple state transitions.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link ProcessConduitQueryParameters}
 */
export function prepareProcessConduitQuery(parameters: ProcessConduitQueryParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [parameters.query],
  } as const
}
