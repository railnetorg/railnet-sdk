import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type SetMaxTotalAssetsParameters = {
  vehicleManager: Address
  /**
   * Hard cap on `totalAssets()` in asset units, enforced at deposit time. `2n ** 256n - 1n` means
   * uncapped. Operator-driven flows that grow `totalAssets()` without minting shares are exempt.
   */
  maxTotalAssets: bigint
}

/**
 * Caps the total assets a multi vehicle will accept on deposit.
 *
 * @param parameters - {@link SetMaxTotalAssetsParameters}
 */
export function buildSetMaxTotalAssetsCall(parameters: SetMaxTotalAssetsParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'setMaxTotalAssets',
    args: [parameters.maxTotalAssets],
  } as const
}
