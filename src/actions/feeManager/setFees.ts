import type { Address } from 'viem'
import { feeManagerAbi } from '../../abi/feeManager.js'
import type { Fees } from './types.js'

export type SetFeesParameters = {
  feeManager: Address
  fees: Fees
}

/**
 * Sets the fee rates. The caller needs FEE_MANAGER_SET_FEES. Each rate is capped by the matching
 * `initialMaxFees` fixed at spawn, and re-sending the current rates reverts `StateUnchanged`.
 *
 * @param parameters - {@link SetFeesParameters}
 */
export function buildSetFeesCall(parameters: SetFeesParameters) {
  return {
    address: parameters.feeManager,
    abi: feeManagerAbi,
    functionName: 'setFees',
    args: [parameters.fees],
  } as const
}
