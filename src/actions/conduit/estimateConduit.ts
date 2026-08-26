import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset, ConduitMode } from './types.js'

export enum EstimationType {
  INPUT = 0,
  OUTPUT = 1,
}

export type EstimateConduitParameters = {
  conduit: Address
  asset: Asset
  mode: ConduitMode
  estimationType: EstimationType
}

export type EstimateConduitReturnType = Asset

/**
 * Estimates the output asset for a deposit or redeem operation on a conduit. Includes conduit fees.
 * @param client - Viem client instance
 * @param parameters - Conduit address, input asset, mode (deposit/redeem), and estimation type (input/output)
 * @returns The estimated output asset
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
