import type { Address, Hex } from 'viem'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import type { Sector } from '../../constants/sectors.js'

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
/**
 * Moves assets or shares between accounting sectors on a multi-vehicle's SectorAccountingEngine. Requires the `MULTI_VEHICLE_MOVE` role scoped to the engine.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link MoveBetweenSectorsParameters}
 */
export function buildMoveBetweenSectorsCall(parameters: MoveBetweenSectorsParameters) {
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
