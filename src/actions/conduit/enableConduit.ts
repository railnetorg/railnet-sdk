import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitParameters = {
  conduit: Address
}

export type EnableConduitReturnType = {
  transactionHash: Hash
}

export async function enableConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: EnableConduitParameters & { account: Address },
): Promise<EnableConduitReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })
  if (receipt.status === 'reverted') {
    throw new Error('Enable conduit transaction reverted')
  }

  return { transactionHash: hash }
}
