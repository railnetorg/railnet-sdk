import { type Address, type Client, type Hex, maxUint256 } from 'viem'
import { simulateContract } from 'viem/actions'
import { sectorAccountingEngineAbi } from '../../abi/sectorAccountingEngine.js'
import type { Sector } from '../../constants/sectors.js'
import type { ConduitMode, ConduitState, Query } from '../conduit/types.js'

export type DispatchVehicleParameters = {
  sectorAccountingEngine: Address
  vehicle: Address
  mode: ConduitMode
  amount: bigint
  settledDestination: Sector
  rejectedDestination: Sector
  minOutput?: bigint
  data?: Hex
  operationId: Hex
}

export type SimulateDispatchVehicleReturnType = {
  query: Query
  state: ConduitState
}

/**
 * Builds the `sectorAccountingEngine.dispatch()` call for {@link dispatchVehicle} without sending it. Throws when `minOutput` is combined with an `amount` of `maxUint256`, which the engine rejects.
 * @param parameters - {@link DispatchVehicleParameters}
 */
/**
 * Dispatches a deposit or redeem between a sector and a sub-vehicle, via the multi-vehicle's SectorAccountingEngine.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link DispatchVehicleParameters}
 */
export function buildDispatchVehicleCall(parameters: DispatchVehicleParameters) {
  const minOutput = parameters.minOutput ?? 0n

  // the engine reverts this combination with MinOutputRequiresPinnedAmount
  if (parameters.amount === maxUint256 && minOutput > 0n) {
    throw new Error(
      'minOutput requires a pinned amount: pass an explicit amount, or set minOutput to 0n when dispatching the entire sector balance',
    )
  }

  return {
    address: parameters.sectorAccountingEngine,
    abi: sectorAccountingEngineAbi,
    functionName: 'dispatch',
    args: [
      {
        vehicle: parameters.vehicle,
        mode: parameters.mode,
        amount: parameters.amount,
        settledDestination: parameters.settledDestination,
        rejectedDestination: parameters.rejectedDestination,
        minOutput,
        data: parameters.data ?? '0x',
        operationId: parameters.operationId,
      },
    ],
  } as const
}

/**
 * Simulates a dispatch without sending a transaction, returning the query it would create and the state it would reach.
 * A state of `SETTLED` means the dispatch completes in one transaction; `PROCESSING` means the vehicle is async and
 * the query needs progressing later.
 * @param parameters - Same parameters as {@link dispatchVehicle}
 * @returns The dispatched query, needed to progress it later, and the resulting state
 *
 * @param parameters - {@link DispatchVehicleParameters}
 *
 * @example
 * import { ConduitState, simulateDispatchVehicle } from '@railnetorg/railnet-sdk'
 *
 * const { query, state } = await simulateDispatchVehicle(publicClient, dispatchParameters)
 *
 * if (state !== ConduitState.SETTLED) {
 *   // async vehicle: keep `query` to progress it once the vehicle settles
 * }
 */
export async function simulateDispatchVehicle(
  client: Client,
  parameters: DispatchVehicleParameters & { account: Address },
): Promise<SimulateDispatchVehicleReturnType> {
  const { result } = await simulateContract(client, {
    ...buildDispatchVehicleCall(parameters),
    account: parameters.account,
  })

  const [query, state] = result

  return { query, state }
}
