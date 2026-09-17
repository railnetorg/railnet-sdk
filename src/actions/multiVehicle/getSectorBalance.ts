import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import type { Sector } from '../../constants/sectors.js'

export type GetSectorBalanceParameters = {
  sectorAccountingEngine: Address
  sector: Sector
  /**
   * The base asset for an asset sector, the sub-vehicle's own address for a share sector — the
   * engine indexes a balance by both, so a vehicle sector holding shares is read with the vehicle
   * as `asset`.
   */
  asset: Address
}

export type GetSectorBalanceReturnType = bigint

/**
 * Reads what one accounting sector holds of one asset, in that asset's own units —
 * `sectorAccountingEngine.getSectorBalance()`.
 *
 * {@link buildRebalanceRedeemCall} settles its redeem into the destination vehicle's sector, and on
 * an async source that lands only once the query progresses. Poll here for a non-zero balance
 * before dispatching the deposit that follows.
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
