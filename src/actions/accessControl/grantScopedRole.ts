import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GrantScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

/**
 * Grants a role to an address, scoped to a specific contract. The caller must be the default admin of the access control.
 *
 * @param parameters - {@link GrantScopedRoleParameters}
 */
export function prepareGrantScopedRole(parameters: GrantScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'grantScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
  } as const
}
