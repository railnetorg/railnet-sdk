import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
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
  walletClient: WalletClient<Transport, Chain>,
  parameters: ProcessConduitQueryParameters & { account: Address },
): Promise<Hash> {
  const { conduit, account, query } = parameters

  return walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [query],
    account,
    chain: walletClient.chain,
  })
}
