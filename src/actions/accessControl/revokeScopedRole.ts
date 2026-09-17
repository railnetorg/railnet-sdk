import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Revokes a previously granted scoped role from an address. The caller must hold the role's admin role — `DEFAULT_ADMIN_ROLE` unless it was
 * reassigned — either globally or scoped to the same `scope`.
 * Reverts `PublicRoleAuthDenied` when that scoped role is already public.
 *
 * @param parameters - {@link RevokeScopedRoleParameters}
 */
export function buildRevokeScopedRoleCall(parameters: RevokeScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
  } as const
}
