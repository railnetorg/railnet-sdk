import type { Address, Chain, Client, Transport } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ConduitPosition } from './types.js'

export type GetConduitPositionParameters = {
  conduit: Address
  account: Address
}

export type GetConduitPositionReturnType = ConduitPosition

export async function getConduitPosition<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: GetConduitPositionParameters,
): Promise<GetConduitPositionReturnType> {
  const { conduit, account } = parameters

  const [shares, asset] = await Promise.all([
    readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'balanceOf',
      args: [account],
    }),
    readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'asset',
    }),
  ])

  let assets = 0n
  if (shares > 0n) {
    const converted = await readContract(client, {
      address: conduit,
      abi: conduitAbi,
      functionName: 'convert',
      args: [[{ asset, value: shares }], true],
    })
    assets = converted[0]?.value ?? 0n
  }

  return { shares, assets, conduit, account }
}
