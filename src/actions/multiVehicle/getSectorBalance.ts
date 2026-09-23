import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import type { Sector } from '../../constants/sectors.js'

export type GetSectorBalanceParameters = {
  sectorAccountingEngine: Address
  sector: Sector
  /** The base asset for an asset sector, or the sub-vehicle's own address for a share sector. */
  asset: Address
}

export type GetSectorBalanceReturnType = bigint

/**
 * Reads a MultiVehicle sector's balance of one asset.
 *
 * @param parameters - {@link GetSectorBalanceParameters}
 *
 * @example
 * import { getSectorBalance, vehicleSector } from '@railnetorg/railnet-sdk'
 *
 * const staged = await getSectorBalance(publicClient, {
 *   sectorAccountingEngine,
 *   sector: vehicleSector(destination),
 *   asset: baseAsset,
 * })
 */
export async function getSectorBalance(
  client: Client,
  parameters: GetSectorBalanceParameters,
): Promise<GetSectorBalanceReturnType> {
  return readContract(client, {
    address: parameters.sectorAccountingEngine,
    abi: sectorAccountingEngineAbi,
    functionName: 'getSectorBalance',
    args: [parameters.sector, parameters.asset],
  })
}
