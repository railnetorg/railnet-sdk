import type { Address, Chain, Hash, PublicClient, Transport, WalletClient } from 'viem'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export async function finalizeConduitDeposit(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: FinalizeConduitDepositParameters & { account: Address },
): Promise<Hash> {
  const { request } = await publicClient.simulateContract({
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
