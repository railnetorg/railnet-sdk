import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import type { Sector } from '../../constants/sectors.js'
import type { ContractCallOptions } from '../../types.js'

export type MoveBetweenSectorsParameters = {
  sectorAccountingEngine: Address
  from: Sector
  to: Sector
  asset: Address
  amount: bigint
  operationId: Hex
}

/**
 * Builds the `sectorAccountingEngine.move()` call for {@link moveBetweenSectors} without sending it.
 * @param parameters - {@link MoveBetweenSectorsParameters}
 */
export function prepareMoveBetweenSectors(parameters: MoveBetweenSectorsParameters) {
  return {
    address: parameters.sectorAccountingEngine,
    abi: sectorAccountingEngineAbi,
    functionName: 'move',
    args: [
      {
        from: parameters.from,
        to: parameters.to,
        asset: parameters.asset,
        amount: parameters.amount,
        operationId: parameters.operationId,
      },
    ],
  } as const
}

/**
 * Moves assets or shares between accounting sectors on a multi-vehicle's SectorAccountingEngine. Requires the `MULTI_VEHICLE_MOVE` role scoped to the engine.
 * Pass `maxUint256` as `amount` to move the entire balance of the source sector. `SECTOR_RESERVED` accepts assets only, share moves into it are rejected.
 *
 * @param parameters - {@link MoveBetweenSectorsParameters}
 *
 * @example
 * import { moveBetweenSectors, SECTOR_AVAILABLE, SECTOR_RESERVED } from '@railnetorg/railnet-sdk'
 *
 * const hash = await moveBetweenSectors(walletClient, {
 *   sectorAccountingEngine: contracts.sectorAccountingEngine,
 *   from: SECTOR_AVAILABLE,
 *   to: SECTOR_RESERVED,
 *   asset: usdc,
 *   amount: 1_000_000n,
 *   operationId,
 *   account: account.address,
 * })
 */
export async function moveBetweenSectors(
  client: Client,
  parameters: MoveBetweenSectorsParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareMoveBetweenSectors(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
