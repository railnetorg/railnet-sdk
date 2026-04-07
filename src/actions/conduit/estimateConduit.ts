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
  assets: Asset[]
  mode: ConduitMode
  estimationType: EstimationType
}

export type EstimateConduitReturnType = Asset[]

/**
 * Estimates the output assets for a deposit or redeem operation on a conduit.
 * @param client - Viem client instance
 * @param parameters - Conduit address, input assets, mode (deposit/redeem), and estimation type (input/output)
 * @returns Array of estimated output assets with their values
 */
export async function estimateConduit(
  client: Client,
  parameters: EstimateConduitParameters,
): Promise<EstimateConduitReturnType> {
  const result = await readContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'estimate',
    args: [parameters.assets, parameters.mode, parameters.estimationType],
  })

  return result.map((a) => ({ asset: a.asset, value: a.value }))
}
