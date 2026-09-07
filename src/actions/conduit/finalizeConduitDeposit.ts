import type { Address } from 'viem'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

/**
 * Finalizes the initial deposit on a conduit with an async vehicle (e.g. Ethena, Syrup). Called via the ConduitFactory after the vehicle's async query resolves.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
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
