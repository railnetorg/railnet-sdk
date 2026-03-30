import type { Address, Client } from 'viem'
import { multicall } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type ConduitInfo = {
  conduit: Address
  asset: Address
  totalSupply: bigint
  totalAssets: bigint
  holdings: bigint
  decimals: number
  name: string
  symbol: string
  ready: boolean
}

export type GetConduitInfoParameters = {
  conduit: Address
}

export type GetConduitInfoReturnType = ConduitInfo

export async function getConduitInfo(
  client: Client,
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
      { address: conduit, abi: conduitAbi, functionName: 'ready' },
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
    ready: results[7],
  }
}
