import type { Address, Chain, Client, Transport } from 'viem'
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
