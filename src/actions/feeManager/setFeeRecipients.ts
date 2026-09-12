import type { Address } from 'viem'
import { feeManagerAbi } from '../../abi/feeManager.js'
import { assertFeeRecipients, type FeeRecipient } from './types.js'

export type SetFeeRecipientsParameters = {
  feeManager: Address
  recipients: readonly FeeRecipient[]
}

/**
 * Replaces the whole recipient split, which must be non-empty and satisfy {@link FeeRecipient}.
 * The caller needs FEE_MANAGER_SET_FEE_RECIPIENTS.
 *
 * @param parameters - {@link SetFeeRecipientsParameters}
 * @throws Error if the split is empty, out of order, or does not total 10000 bps
 */
export function buildSetFeeRecipientsCall(parameters: SetFeeRecipientsParameters) {
  assertFeeRecipients(parameters.recipients)

  return {
    address: parameters.feeManager,
    abi: feeManagerAbi,
    functionName: 'setFeeRecipients',
    args: [parameters.recipients],
  } as const
}
