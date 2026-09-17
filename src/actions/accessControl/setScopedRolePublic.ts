import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type SetScopedRolePublicParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  isPublic: boolean
}

/**
 * Sets whether a scoped role is public (callable by any address) or restricted. The caller must hold the role's admin role — `DEFAULT_ADMIN_ROLE` unless it was
 * reassigned — either globally or scoped to the same `scope`.
 * `DEFAULT_ADMIN_ROLE` cannot be made public (`DefaultAdminCannotBePublic`), and re-sending the
 * current status reverts `RolePublicStatusUnchanged`.
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
