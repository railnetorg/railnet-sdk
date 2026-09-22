import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { baseVehicleAbi } from '../../abi/baseVehicle.js'
import type { Asset } from '../../types.js'

export type GetVehicleConversionParameters = {
  vehicle: Address
  /** Only `value` is read. */
  asset: Asset
  sharesToAssets: boolean
}

export type GetVehicleConversionReturnType = Asset

/**
 * Prices shares against assets at the vehicle's current rate, applying ongoing fee dilution and
 * ignoring transactional fees. Unlike {@link estimateVehicle}, it does not revert `InvalidInput`
 * or `ZeroInputValue`.
 *
 * @param parameters - {@link GetVehicleConversionParameters}
 *
 * @example
 * import { getVehicleConversion } from '@railnetorg/railnet-sdk'
 *
 * const held = await getVehicleConversion(publicClient, {
 *   vehicle,
 *   asset: { asset: vehicle, value: shares },
 *   sharesToAssets: true,
 * })
 */
export async function getVehicleConversion(
  client: Client,
  parameters: GetVehicleConversionParameters,
): Promise<GetVehicleConversionReturnType> {
  const converted = await readContract(client, {
    address: parameters.vehicle,
    abi: baseVehicleAbi,
    functionName: 'convert',
    args: [parameters.asset, parameters.sharesToAssets],
  })

  return { asset: converted.asset, value: converted.value }
}
