import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export async function finalizeConduitDeposit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: FinalizeConduitDepositParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
