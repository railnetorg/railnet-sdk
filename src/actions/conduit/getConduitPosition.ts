import type { Address, Client } from 'viem'
import { getBlockNumber, readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type ConduitPosition = {
  shares: bigint
  assets: bigint
  conduit: Address
  account: Address
  /** The block both reads were served at, so a caller can tell what the position is true of. */
  blockNumber: bigint
}

export type GetConduitPositionParameters = {
  conduit: Address
  account: Address
  /** Defaults to the current block. */
  blockNumber?: bigint
}

export type GetConduitPositionReturnType = ConduitPosition

/**
 * Reads an account's position in a conduit: share balance and the equivalent asset value.
 * `convert` takes the balance, so the two reads cannot be batched — they are pinned to one block
 * instead, or a deposit landing between them reports shares at one rate and assets at another.
 *
 * @param parameters - {@link GetConduitPositionParameters}
 *
 * @example
 * import { getConduitPosition } from '@railnetorg/railnet-sdk'
 *
 * const position = await getConduitPosition(publicClient, {
 *   conduit: conduitAddress,
 *   account: account.address,
 * })
 */
export async function getConduitPosition(
  client: Client,
  parameters: GetConduitPositionParameters,
): Promise<GetConduitPositionReturnType> {
  const { conduit, account } = parameters
  // cacheTime 0: viem caches the block number for `client.cacheTime` by default, which would pin
  // the reads to a block up to a polling interval old — a position read right after a receipt
  // would miss the deposit that receipt confirmed.
  const blockNumber = parameters.blockNumber ?? (await getBlockNumber(client, { cacheTime: 0 }))

  const shares = await readContract(client, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'balanceOf',
    args: [account],
    blockNumber,
  })

  let assets = 0n
  if (shares > 0n) {
    const converted = await readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'convert',
      args: [{ asset: conduit, value: shares }, true],
      blockNumber,
    })
    assets = converted.value
  }

  return { shares, assets, conduit, account, blockNumber }
}
