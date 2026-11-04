import type { Address, Client } from 'viem'
import { getBlockNumber, readContract } from 'viem/actions'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import { SECTOR_AVAILABLE, SECTOR_RESERVED } from '../../constants/sectors.js'

export type VehicleHoldings = {
  vehicle: Address
  /** Settled shares in the ALLOCATION sector. */
  sharesAfterUnlocks: bigint
  /** Shares staged in the vehicle's sector, waiting for a redeem query. */
  sharesBeforeCreates: bigint
  /** Shares expected from in-flight deposit queries, on top of `sharesAfterUnlocks`. */
  expectedSharesAfterUnlocks: bigint
  /** Base assets expected from in-flight redeem queries. */
  expectedAssetsAfterUnlocks: bigint
  /** Base assets staged in the vehicle's sector, waiting for a deposit query. */
  assetsBeforeCreates: bigint
}

export type MultiVehiclePositions = {
  sectorAccountingEngine: Address
  asset: Address
  /** Base assets in the AVAILABLE sector, what `withdrawable()` returns. */
  available: bigint
  /** Base assets in the RESERVED sector, counted in `totalAssets()` but not withdrawable. */
  reserved: bigint
  /** One entry per vehicle in `activeVehicles()`, the set `totalAssets()` values. */
  vehicles: VehicleHoldings[]
  /** The block every read was served at. */
  blockNumber: bigint
}

export type GetMultiVehiclePositionsParameters = {
  sectorAccountingEngine: Address
  /** Defaults to the current block. */
  blockNumber?: bigint
}

export type GetMultiVehiclePositionsReturnType = MultiVehiclePositions

/**
 * Reads where a MultiVehicle's assets sit: its idle and reserved base assets, and each active
 * vehicle's holdings, all pinned to the same block.
 *
 * @param parameters - {@link GetMultiVehiclePositionsParameters}
 *
 * @example
 * import { getMultiVehiclePositions } from '@railnetorg/railnet-sdk'
 *
 * const positions = await getMultiVehiclePositions(publicClient, { sectorAccountingEngine })
 */
export async function getMultiVehiclePositions(
  client: Client,
  parameters: GetMultiVehiclePositionsParameters,
): Promise<GetMultiVehiclePositionsReturnType> {
  const { sectorAccountingEngine } = parameters
  const blockNumber = parameters.blockNumber ?? (await getBlockNumber(client, { cacheTime: 0 }))
  const engine = { address: sectorAccountingEngine, abi: sectorAccountingEngineAbi, blockNumber }

  const [asset, activeVehicles] = await Promise.all([
    readContract(client, { ...engine, functionName: 'asset' }),
    readContract(client, { ...engine, functionName: 'activeVehicles' }),
  ])
  const [available, reserved, vehicles] = await Promise.all([
    readContract(client, {
      ...engine,
      functionName: 'getSectorBalance',
      args: [SECTOR_AVAILABLE, asset],
    }),
    readContract(client, {
      ...engine,
      functionName: 'getSectorBalance',
      args: [SECTOR_RESERVED, asset],
    }),
    Promise.all(
      activeVehicles.map(async (vehicle): Promise<VehicleHoldings> => {
        const [
          sharesAfterUnlocks,
          sharesBeforeCreates,
          expectedSharesAfterUnlocks,
          expectedAssetsAfterUnlocks,
          assetsBeforeCreates,
        ] = await readContract(client, {
          ...engine,
          functionName: 'vehicleHoldings',
          args: [vehicle],
        })
        return {
          vehicle,
          sharesAfterUnlocks,
          sharesBeforeCreates,
          expectedSharesAfterUnlocks,
          expectedAssetsAfterUnlocks,
          assetsBeforeCreates,
        }
      }),
    ),
  ])

  return { sectorAccountingEngine, asset, available, reserved, vehicles, blockNumber }
}
