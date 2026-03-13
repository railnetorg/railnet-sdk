import type { Address, Chain, Hash, PublicClient, Transport, WalletClient } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitParameters = {
  conduit: Address
}

export async function enableConduit(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: EnableConduitParameters & { account: Address },
): Promise<Hash> {
  const { request } = await publicClient.simulateContract({
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
