import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitParameters = {
  conduit: Address
}

export async function enableConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: EnableConduitParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
