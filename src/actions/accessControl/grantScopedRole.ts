import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Grants a role to an address, scoped to a specific contract. The caller must hold the role's admin role — `DEFAULT_ADMIN_ROLE` unless it was
 * reassigned — either globally or scoped to the same `scope`.
 * Reverts `PublicRoleAuthDenied` when that scoped role is already public.
 *
 * @param parameters - {@link GrantScopedRoleParameters}
 */
export function buildGrantScopedRoleCall(parameters: GrantScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
  } as const
}
