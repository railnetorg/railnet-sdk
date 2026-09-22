import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Revokes a scoped role from an address. The caller holds the role's admin role, globally or
 * scoped to the same `scope`. Reverts `PublicRoleAuthDenied` while that scoped role is public.
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
