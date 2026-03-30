import type { Address, Client, Hash, Hex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Asset, ConduitMode } from './types.js'

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: {
    owner: Address
    receiver: Address
    input: Asset[]
    output: Asset[]
    mode: ConduitMode
    salt: Hex
    data: Hex
  }
}

export async function processConduitQuery(
  publicClient: Client,
  walletClient: Client,
  parameters: ProcessConduitQueryParameters & { account: Address },
): Promise<Hash> {
  const { conduit, account, query } = parameters

  const { request } = await simulateContract(publicClient, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [query],
    account,
  })

  return writeContract(walletClient, request)
}
