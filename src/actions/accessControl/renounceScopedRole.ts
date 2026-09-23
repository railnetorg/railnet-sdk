import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type RenounceScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  /** Must be the sender, or the call reverts `OnlyOwnerCanRenounce`. */
  account: Address
}

/**
 * Gives up a scoped role held by the caller, needing no admin role. Reverts `PublicRoleAuthDenied`
 * while that scoped role is public.
 *
 * @param parameters - {@link RenounceScopedRoleParameters}
 */
export function buildRenounceScopedRoleCall(parameters: RenounceScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'renounceScopedRole',
    args: [parameters.role, parameters.scope, parameters.account],
  } as const
}
