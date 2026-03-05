import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export type FinalizeConduitDepositReturnType = {
  transactionHash: Hash
}

export async function finalizeConduitDeposit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: FinalizeConduitDepositParameters & { account: Address },
): Promise<FinalizeConduitDepositReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Finalize conduit deposit transaction reverted')
  }

  return { transactionHash: hash }
}
