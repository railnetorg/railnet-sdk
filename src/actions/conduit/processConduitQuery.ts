import type { Address, Chain, Hash, Hex, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
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

export type ProcessConduitQueryReturnType = {
  transactionHash: Hash
}

export async function processConduitQuery(
  walletClient: WalletClient<Transport, Chain>,
  parameters: ProcessConduitQueryParameters & { account: Address },
): Promise<ProcessConduitQueryReturnType> {
  const { conduit, account, query } = parameters

  const hash = await walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'process',
    args: [query],
    account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })
  if (receipt.status === 'reverted') {
    throw new Error('Process query transaction reverted')
  }

  return { transactionHash: hash }
}
