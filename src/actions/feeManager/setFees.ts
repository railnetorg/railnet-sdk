import type { Address } from 'viem'
import { feeManagerAbi } from '../../abi/feeManager.js'
import { assertFees, type Fees } from './types.js'

export type SetFeesParameters = {
  feeManager: Address
  fees: Fees
}

/**
 * Sets the fee rates. The caller needs FEE_MANAGER_SET_FEES. Each rate is capped by the matching
 * `initialMaxFees` fixed at spawn, and re-sending the current rates reverts `StateUnchanged`.
 *
 * @param parameters - {@link SetFeesParameters}
 * @throws Error if a rate is not an integer within its ceiling: 10000 for the ongoing fees, 9999
 * for the transactional ones, which stay reversible
 */
export function buildSetFeesCall(parameters: SetFeesParameters) {
  assertFees(parameters.fees)

  return {
    address: parameters.feeManager,
    abi: feeManagerAbi,
    functionName: 'setFees',
    args: [parameters.fees],
  } as const
}
