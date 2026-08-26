import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'
import type { ContractCallOptions } from '../../types.js'

export type RevokeScopedRoleParameters = {
  accessControl: Address
  role: Hex
  scope: Address
  grantee: Address
}

export function prepareRevokeScopedRole(parameters: RevokeScopedRoleParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'revokeScopedRole',
    args: [parameters.role, parameters.scope, parameters.grantee],
  } as const
}

/**
 * Revokes a previously granted scoped role from an address. The caller must be the default admin of the access control.
 *
 * @param parameters - {@link RevokeScopedRoleParameters}
 *
 * @example
 * import { revokeScopedRole, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'
 *
 * const hash = await revokeScopedRole(walletClient, {
 *   accessControl: eacAddress,
 *   role: VEHICLE_STEAM_DEPOSIT,
 *   scope: vehicleAddress,
 *   grantee: multiVehicleAddress,
 *   account: account.address,
 * })
 */
export async function revokeScopedRole(
  client: Client,
  parameters: RevokeScopedRoleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareRevokeScopedRole(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
