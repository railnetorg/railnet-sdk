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
}

export type GetConduitInfoParameters = {
  conduit: Address
}

export type GetConduitInfoReturnType = ConduitInfo

/**
 * Reads on-chain metadata for a conduit via a single multicall: name, symbol, decimals, asset, totalSupply, totalAssets, and holdings.
 * @param client - Viem client instance
 * @param parameters - The conduit address to query
 * @returns Conduit metadata including supply, assets, and holdings
 */
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
  }
}
