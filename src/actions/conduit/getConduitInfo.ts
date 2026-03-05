import type { Address, Chain, Client, Transport } from 'viem'
import { multicall } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ConduitInfo } from './types.js'

export type GetConduitInfoParameters = {
  conduit: Address
}

export type GetConduitInfoReturnType = ConduitInfo

export async function getConduitInfo<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: GetConduitInfoParameters,
): Promise<GetConduitInfoReturnType> {
  const { conduit } = parameters

  const results = await multicall(client, {
    contracts: [
      { address: conduit, abi: conduitAbi, functionName: 'asset' },
      { address: conduit, abi: conduitAbi, functionName: 'totalSupply' },
      { address: conduit, abi: conduitAbi, functionName: 'totalAssets' },
      { address: conduit, abi: conduitAbi, functionName: 'holdings' },
      { address: conduit, abi: conduitAbi, functionName: 'decimals' },
      { address: conduit, abi: conduitAbi, functionName: 'name' },
      { address: conduit, abi: conduitAbi, functionName: 'symbol' },
      { address: conduit, abi: conduitAbi, functionName: 'isEnabled' },
    ] as const,
    allowFailure: false,
  })

  return {
    conduit,
    asset: results[0],
    totalSupply: results[1],
    totalAssets: results[2],
    holdings: results[3],
    decimals: results[4],
    name: results[5],
    symbol: results[6],
    isEnabled: results[7],
  }
}
