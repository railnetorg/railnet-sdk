import type { Address } from 'viem'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

/**
 * Settles the seed deposit an asynchronous vehicle left pending after `spawn()`, and enables the
 * conduit once it reaches SETTLED. No role gates it; reverts `NoPendingDeposit` when nothing is
 * pending.
 *
 * @param parameters - {@link FinalizeConduitDepositParameters}
 */
export function buildFinalizeConduitDepositCall(parameters: FinalizeConduitDepositParameters) {
  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
  } as const
}
