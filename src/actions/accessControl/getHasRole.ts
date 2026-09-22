import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GetHasRoleParameters = {
  accessControl: Address
  role: Hex
  /** Contract the role is scoped to, the one that performs the gated call. */
  scope: Address
  account: Address
}

export type GetHasRoleReturnType = boolean

/**
 * Whether an account may act under a role, holding it either globally or scoped to `scope`.
 *
 * @param parameters - {@link GetHasRoleParameters}
 *
 * @example
 * import { getHasRole, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'
 *
 * const allowed = await getHasRole(publicClient, {
 *   accessControl,
 *   role: VEHICLE_STEAM_DEPOSIT,
 *   scope: vehicle,
 *   account: subQueryEngine,
 * })
 */
export async function getHasRole(
  client: Client,
  parameters: GetHasRoleParameters,
): Promise<GetHasRoleReturnType> {
  const { accessControl, role, scope, account } = parameters

  return await readContract(client, {
    address: accessControl,
    abi: externalAccessControlAbi,
    functionName: 'hasRoleOrScopedRole',
    args: [role, scope, account],
  })
}
