import type { Address, Hex } from 'viem'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type SetScopedRolePublicParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  isPublic: boolean
}

/**
 * Sets whether a scoped role is public (callable by any address) or restricted. The caller must be the default admin.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
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
