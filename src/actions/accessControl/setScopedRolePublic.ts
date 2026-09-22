import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type SetScopedRolePublicParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  isPublic: boolean
}

/**
 * Sets whether a scoped role is callable by any address. The caller holds the role's admin role,
 * globally or scoped to the same `scope`. Reverts `DefaultAdminCannotBePublic` on
 * `DEFAULT_ADMIN_ROLE` and `RolePublicStatusUnchanged` when the status already holds.
 *
 * @param parameters - {@link SetScopedRolePublicParameters}
 */
export function buildSetScopedRolePublicCall(parameters: SetScopedRolePublicParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'setScopedRolePublic',
    args: [parameters.role, parameters.scope, parameters.isPublic],
  } as const
}
