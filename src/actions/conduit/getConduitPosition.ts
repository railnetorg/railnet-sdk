import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type ConduitPosition = {
  shares: bigint
  assets: bigint
  conduit: Address
  account: Address
}

export type GetConduitPositionParameters = {
  conduit: Address
  account: Address
}

export type GetConduitPositionReturnType = ConduitPosition

/**
 * Reads an account's position in a conduit: share balance and the equivalent asset value.
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

  const shares = await readContract(client, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'balanceOf',
    args: [account],
  })

  let assets = 0n
  if (shares > 0n) {
    const converted = await readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'convert',
      args: [{ asset: conduit, value: shares }, true],
    })
    assets = converted.value
  }

  return { shares, assets, conduit, account }
}
