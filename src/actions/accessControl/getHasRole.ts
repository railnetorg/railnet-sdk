import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type GetHasRoleParameters = {
  accessControl: Address
  role: Hex
  /**
   * Contract the role is scoped to. Pass the contract that performs the gated call — a scoped grant
   * only counts for its own scope.
   */
  scope: Address
  account: Address
}

export type GetHasRoleReturnType = boolean

/**
 * Whether an account may act under a role, holding it either globally or scoped to `scope`.
 *
 * Mirrors what the contracts themselves check: `ExternalAccessControl.hasRoleOrScopedRole` is the
 * function behind `AccessControlLib.gatedCheckRole` / `ungatedCheckRole`, so a `true` here means the
 * corresponding gated call will not revert on the role check. A role marked public reads as held by
 * every account.
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
