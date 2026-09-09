import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset, EstimationType, QueryMode } from '../../types.js'

export type EstimateConduitParameters = {
  conduit: Address
  asset: Asset
  mode: QueryMode
  estimationType: EstimationType
}

export type EstimateConduitReturnType = Asset

/**
 * Estimates the output asset for a deposit or redeem operation on a conduit. Includes conduit fees.
 *
 * @param parameters - {@link EstimateConduitParameters}
 *
 * @example
 * import { estimateConduit, EstimationType, QueryMode } from '@railnetorg/railnet-sdk'
 *
 * const estimation = await estimateConduit(publicClient, {
 *   conduit: conduitAddress,
 *   asset: { asset: usdc, value: 1_000_000n },
 *   mode: QueryMode.DEPOSIT,
 *   estimationType: EstimationType.OUTPUT,
 * })
 */
export async function estimateConduit(
  client: Client,
  parameters: EstimateConduitParameters,
): Promise<EstimateConduitReturnType> {
  const result = await readContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'estimate',
    args: [parameters.asset, parameters.mode, parameters.estimationType],
  })

  return { asset: result.asset, value: result.value }
}
