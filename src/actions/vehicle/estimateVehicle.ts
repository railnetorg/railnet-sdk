import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { baseVehicleAbi } from '../../abi/baseVehicle.js'
import type { EstimationType } from '../conduit/estimateConduit.js'
import type { Asset, ConduitMode } from '../conduit/types.js'

export type EstimateVehicleParameters = {
  vehicle: Address
  asset: Asset
  mode: ConduitMode
  estimationType: EstimationType
}

export type EstimateVehicleReturnType = Asset

/**
 * Estimates a vehicle's own output, which is what a deposit's `minOutput` floor is measured
 * against: `BaseVehicle._validateConstraints` compares `query.output.value` to this, not to the
 * conduit's estimate, which is net of the conduit's own fees.
 *
 * @param parameters - {@link EstimateVehicleParameters}
 *
 * @example
 * import { ConduitMode, estimateVehicle, EstimationType } from '@railnetorg/railnet-sdk'
 *
 * const estimation = await estimateVehicle(publicClient, {
 *   vehicle: vehicleAddress,
 *   asset: { asset: usdc, value: 1_000_000n },
 *   mode: ConduitMode.DEPOSIT,
 *   estimationType: EstimationType.OUTPUT,
 * })
 */
export async function estimateVehicle(
  client: Client,
  parameters: EstimateVehicleParameters,
): Promise<EstimateVehicleReturnType> {
  const result = await readContract(client, {
    address: parameters.vehicle,
    abi: baseVehicleAbi,
    functionName: 'estimate',
    args: [parameters.asset, parameters.mode, parameters.estimationType],
  })

  return { asset: result.asset, value: result.value }
}

/** Lowers an estimate by `bps` basis points, floored at zero. */
export function applySlippage(estimate: bigint, bps: number): bigint {
  if (!Number.isInteger(bps) || bps < 0 || bps > 10_000) {
    throw new Error(`slippageBps must be an integer between 0 and 10000, got ${bps}`)
  }
  return (estimate * (10_000n - BigInt(bps))) / 10_000n
}
