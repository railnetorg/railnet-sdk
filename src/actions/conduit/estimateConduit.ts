import type { Chain, Client, Transport } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset, EstimateConduitParameters } from './types.js'

export type EstimateConduitReturnType = Asset[]

export async function estimateConduit<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
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
