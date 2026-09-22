import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GlobalRoleParameters = {
  accessControl: Address
  /**
   * A base role, `keccak256(name)`, the form the `constants/roles` exports take. A value already
   * encoded against a scope has the same shape and is stored as a base role; {@link
   * buildGrantScopedRoleCall} confines a role to one contract.
   */
  role: Hex
  account: Address
}

/**
 * Grants a role across every scope. Needs the role's admin role. Reverts `PublicRoleAuthDenied`
 * when the role is already public, `AccessControlEnforcedDefaultAdminRules` for `DEFAULT_ADMIN_ROLE`.
 *
 * @param parameters - {@link GlobalRoleParameters}
 */
export function buildGrantRoleCall(parameters: GlobalRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantRole',
    args: [parameters.role, parameters.account],
  } as const
}

/**
 * Revokes a role across every scope. Needs the role's admin role. Reverts `PublicRoleAuthDenied`
 * when the role is already public, `AccessControlEnforcedDefaultAdminRules` for `DEFAULT_ADMIN_ROLE`.
 * A scoped grant of the same role is untouched.
 *
 * @param parameters - {@link GlobalRoleParameters}
 */
export function buildRevokeRoleCall(parameters: GlobalRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeRole',
    args: [parameters.role, parameters.account],
  } as const
}

export type RenounceRoleParameters = {
  accessControl: Address
  role: Hex
  /** Must be the sender: the contract compares it against `msg.sender`. */
  callerConfirmation: Address
}

/**
 * Gives up a global role held by the caller. `DEFAULT_ADMIN_ROLE` reverts
 * `DefaultAdminCannotBeRenounced`.
 *
 * @param parameters - {@link RenounceRoleParameters}
 */
export function buildRenounceRoleCall(parameters: RenounceRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'renounceRole',
    args: [parameters.role, parameters.callerConfirmation],
  } as const
}

export type SetRolePublicParameters = {
  accessControl: Address
  role: Hex
  isPublic: boolean
}

/**
 * Makes a role callable by any address across every scope, or restricts it back. Needs
 * `DEFAULT_ADMIN_ROLE`, not the role's own admin. Reverts `DefaultAdminCannotBePublic` on
 * `DEFAULT_ADMIN_ROLE` and `RolePublicStatusUnchanged` on the status already stored.
 *
 * @param parameters - {@link SetRolePublicParameters}
 */
export function buildSetRolePublicCall(parameters: SetRolePublicParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'setRolePublic',
    args: [parameters.role, parameters.isPublic],
  } as const
}
