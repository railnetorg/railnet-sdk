import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Grants a role to an address, scoped to one contract. The caller holds the role's admin role,
 * globally or scoped to the same `scope`. Reverts `PublicRoleAuthDenied` while that scoped role is
 * public.
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
