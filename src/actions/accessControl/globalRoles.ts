import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GlobalRoleParameters = {
  accessControl: Address
  /**
   * A base role, as `keccak256(name)` — the form the `constants/roles` exports take. Never a role
   * already encoded against a scope: `grantRole` cannot tell the two apart and would grant the
   * encoded value as a base role under the global admin, skipping every scoped-role semantic.
   * Use {@link buildGrantScopedRoleCall} for a role that applies to one contract.
   */
  role: Hex
  account: Address
}

/**
 * Grants a role across every scope. The caller must hold the role's admin role —
 * `DEFAULT_ADMIN_ROLE` unless it was reassigned. Reverts `PublicRoleAuthDenied` when the role is
 * already public, since a public role needs no grantee.
 *
 * A global grant is the wide one: prefer {@link buildGrantScopedRoleCall}, which confines the role
 * to the contract that performs the gated call.
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
 * Revokes a global role. Same admin requirement and same `PublicRoleAuthDenied` on a public role as
 * {@link buildGrantRoleCall}. It does not touch a scoped grant of the same role — revoke that with
 * {@link buildRevokeScopedRoleCall}.
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
 * Gives up a global role held by the caller. `DEFAULT_ADMIN_ROLE` cannot be renounced this way
 * (`DefaultAdminCannotBeRenounced`) — hand it over with the two-step default-admin transfer instead.
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
 * Makes a role callable by any address across every scope, or restricts it back. Unlike the scoped
 * variant this one is `DEFAULT_ADMIN_ROLE` only, not the role's own admin.
 *
 * `DEFAULT_ADMIN_ROLE` cannot be made public (`DefaultAdminCannotBePublic`), and re-sending the
 * current status reverts `RolePublicStatusUnchanged`. While a role is public, per-account grant,
 * revoke and renounce on it are all refused.
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
