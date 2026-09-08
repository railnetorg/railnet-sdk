import type { Address } from 'viem'
import { feeManagerAbi } from '../../abi/feeManager.js'

export type DispatchFeesParameters = {
  feeManager: Address
  /** The collected token to pay out, usually the vehicle's asset or its share token. */
  token: Address
}

/**
 * Pays the collected balance of one token out to the recipients, per their current split. The
 * caller needs FEE_MANAGER_DISPATCH_ERC20.
 *
 * @param parameters - {@link DispatchFeesParameters}
 */
export function buildDispatchFeesCall(parameters: DispatchFeesParameters) {
  return {
    address: parameters.feeManager,
    abi: feeManagerAbi,
    functionName: 'dispatchERC20',
    args: [parameters.token],
  } as const
}
