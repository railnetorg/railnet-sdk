import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'

/**
 * Minimal fragment of Morpho Blue's `IMorphoStaticTyping`, from the interface hangar vendors at
 * `lib/morpho-blue/src/interfaces/IMorpho.sol`. Only the market lookup is needed here.
 *
 * That file declares `idToMarketParams` twice. `IMorpho` returns `MarketParams memory`, a tuple;
 * `IMorphoStaticTyping` returns the five members flat, which is what the deployed contract's
 * `public` mapping getter encodes. Regenerate from `IMorphoStaticTyping`, never from `IMorpho`.
 */
export const morphoMarketAbi = [
  {
    type: 'function',
    name: 'idToMarketParams',
    inputs: [{ name: 'id', type: 'bytes32', internalType: 'Id' }],
    outputs: [
      { name: 'loanToken', type: 'address', internalType: 'address' },
      { name: 'collateralToken', type: 'address', internalType: 'address' },
      { name: 'oracle', type: 'address', internalType: 'address' },
      { name: 'irm', type: 'address', internalType: 'address' },
      { name: 'lltv', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const

export type GetMorphoMarketAssetParameters = {
  morpho: Address
  marketId: Hex
}

export type GetMorphoMarketAssetReturnType = Address

/**
 * The asset a Morpho Blue vehicle on this market would take in: the market's loan token, which is
 * what a supplier deposits. Resolved from the market id so a caller never states the asset twice.
 *
 * @param parameters - {@link GetMorphoMarketAssetParameters}
 */
export async function getMorphoMarketAsset(
  client: Client,
  parameters: GetMorphoMarketAssetParameters,
): Promise<GetMorphoMarketAssetReturnType> {
  const [loanToken] = await readContract(client, {
    address: parameters.morpho,
    abi: morphoMarketAbi,
    functionName: 'idToMarketParams',
    args: [parameters.marketId],
  })

  return loanToken
}
