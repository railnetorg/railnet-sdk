import type { Address, Chain, Hash, Hex, PublicClient, Transport, WalletClient } from 'viem'
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
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: ProcessConduitQueryParameters & { account: Address },
): Promise<Hash> {
  const { conduit, account, query } = parameters

  const { request } = await publicClient.simulateContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [query],
    account,
  })

  return walletClient.writeContract(request)
}
