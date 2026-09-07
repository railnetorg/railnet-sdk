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
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
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
