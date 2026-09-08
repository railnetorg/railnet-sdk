import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type VehicleThresholds = {
  /**
   * Unredeemable shares needed to trigger auto-fulfill on deposits, in vehicle shares (18 decimals).
   * `2n ** 256n - 1n` disables auto-fulfill and is where a fresh deployment starts; `0` auto-fulfills
   * every request.
   */
  minSharesForAutoFulfill: bigint
  /**
   * Buffer added on top of a requested redeem, in the multi vehicle's ASSET units — not shares.
   * Rejected above `type(uint128).max`.
   */
  extraAssetsForWithdrawalRequests: bigint
}

export type SetThresholdsParameters = {
  vehicleManager: Address
  thresholds: VehicleThresholds
}

/**
 * Sets a multi vehicle's operational thresholds.
 *
 * Replaces both values together: there is no partial update, so passing 0 for a field left untouched
 * silently enables auto-fulfill rather than leaving it alone.
 *
 * @param parameters - {@link SetThresholdsParameters}
 */
export function buildSetThresholdsCall(parameters: SetThresholdsParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'setThresholds',
    args: [parameters.thresholds],
  } as const
}
