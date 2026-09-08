import type { Address, Client } from 'viem'
import { multicall } from 'viem/actions'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type VehicleManagerLimits = {
  /**
   * Unredeemable shares needed to trigger auto-fulfill on deposits, in vehicle shares (18 decimals).
   * `2n ** 256n - 1n` disables auto-fulfill, and is the value a fresh deployment starts from.
   */
  minSharesForAutoFulfill: bigint
  /**
   * Buffer added on top of a requested redeem, in the multi vehicle's ASSET units — not shares.
   * Capped on write at `type(uint128).max`.
   */
  extraAssetsForWithdrawalRequests: bigint
  /**
   * Hard cap on `totalAssets()`, enforced at deposit time, in asset units. `2n ** 256n - 1n` means
   * uncapped. Operator-driven flows that grow `totalAssets()` without minting are exempt.
   */
  maxTotalAssets: bigint
}

export type GetVehicleManagerLimitsParameters = {
  vehicleManager: Address
}

export type GetVehicleManagerLimitsReturnType = VehicleManagerLimits

/**
 * Reads a multi vehicle's operational limits in one multicall.
 *
 * @param parameters - {@link GetVehicleManagerLimitsParameters}
 *
 * @example
 * import { getVehicleManagerLimits } from '@railnetorg/railnet-sdk'
 *
 * const limits = await getVehicleManagerLimits(publicClient, { vehicleManager })
 */
export async function getVehicleManagerLimits(
  client: Client,
  parameters: GetVehicleManagerLimitsParameters,
): Promise<GetVehicleManagerLimitsReturnType> {
  const { vehicleManager } = parameters

  const results = await multicall(client, {
    contracts: [
      { address: vehicleManager, abi: vehicleManagerAbi, functionName: 'thresholds' },
      { address: vehicleManager, abi: vehicleManagerAbi, functionName: 'maxTotalAssets' },
    ] as const,
    allowFailure: false,
  })

  return {
    minSharesForAutoFulfill: results[0].minSharesForAutoFulfill,
    extraAssetsForWithdrawalRequests: results[0].extraAssetsForWithdrawalRequests,
    maxTotalAssets: results[1],
  }
}
