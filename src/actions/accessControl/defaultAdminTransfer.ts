import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { externalAccessControlAbi } from '../../abi/externalAccessControl.js'

export type BeginDefaultAdminTransferParameters = {
  accessControl: Address
  newAdmin: Address
}

/**
 * Opens the two-step handover of `DEFAULT_ADMIN_ROLE`, scheduling it for `defaultAdminDelay`
 * seconds from now. Needs `DEFAULT_ADMIN_ROLE`. Calling it again overwrites a pending transfer
 * rather than adding one. Reverts `DefaultAdminCannotBeRenounced` when `newAdmin` is the zero
 * address.
 *
 * @param parameters - {@link BeginDefaultAdminTransferParameters}
 */
export function buildBeginDefaultAdminTransferCall(
  parameters: BeginDefaultAdminTransferParameters,
) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'beginDefaultAdminTransfer',
    args: [parameters.newAdmin],
  } as const
}

export type DefaultAdminTransferParameters = {
  accessControl: Address
}

/**
 * Completes the handover once the schedule {@link getPendingDefaultAdmin} returns has passed.
 * Earlier reverts `AccessControlEnforcedDefaultAdminDelay`. A sender other than the pending admin
 * reverts `AccessControlInvalidDefaultAdmin`.
 *
 * @param parameters - {@link DefaultAdminTransferParameters}
 */
export function buildAcceptDefaultAdminTransferCall(parameters: DefaultAdminTransferParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'acceptDefaultAdminTransfer',
    args: [],
  } as const
}

/**
 * Drops a pending handover. Needs `DEFAULT_ADMIN_ROLE`, and works both before and after the
 * schedule has passed, up until the pending admin accepts. Sending it with nothing pending is a
 * no-op.
 *
 * @param parameters - {@link DefaultAdminTransferParameters}
 */
export function buildCancelDefaultAdminTransferCall(parameters: DefaultAdminTransferParameters) {
  return {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'cancelDefaultAdminTransfer',
    args: [],
  } as const
}

export type GetPendingDefaultAdminParameters = {
  accessControl: Address
}

export type GetPendingDefaultAdminReturnType = {
  newAdmin: Address
  /** Unix seconds after which `newAdmin` may accept. Zero when no transfer is pending. */
  schedule: number
}

/**
 * The address a handover is waiting on and when it may accept.
 *
 * @param parameters - {@link GetPendingDefaultAdminParameters}
 *
 * @example
 * import { getPendingDefaultAdmin } from '@railnetorg/railnet-sdk'
 *
 * const { newAdmin, schedule } = await getPendingDefaultAdmin(publicClient, { accessControl })
 * const acceptable = schedule !== 0 && schedule < Math.floor(Date.now() / 1000)
 */
export async function getPendingDefaultAdmin(
  client: Client,
  parameters: GetPendingDefaultAdminParameters,
): Promise<GetPendingDefaultAdminReturnType> {
  const [newAdmin, schedule] = await readContract(client, {
    address: parameters.accessControl,
    abi: externalAccessControlAbi,
    functionName: 'pendingDefaultAdmin',
  })

  return { newAdmin, schedule }
}
