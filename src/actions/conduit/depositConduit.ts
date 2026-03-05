import {
  type Address,
  type Chain,
  erc20Abi,
  keccak256,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import {
  ConduitMode,
  type DepositConduitParameters,
  type DepositConduitReturnType,
} from './types.js'

export async function depositConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: DepositConduitParameters & { account: Address },
): Promise<DepositConduitReturnType> {
  const { conduit, token, amount, account } = parameters
  const receiver = parameters.receiver ?? account
  const salt = parameters.salt ?? keccak256(toHex(`deposit-${account}-${Date.now()}`))

  const allowance = await readContract(walletClient, {
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < amount) {
    const approveHash = await walletClient.writeContract({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [conduit, amount],
      account,
      chain: walletClient.chain,
    })

    const approveReceipt = await waitForTransactionReceipt(walletClient, { hash: approveHash })
    if (approveReceipt.status === 'reverted') {
      throw new Error('Token approval transaction reverted')
    }
  }

  const query = {
    owner: account,
    receiver,
    input: [{ asset: token, value: amount }],
    output: [],
    mode: ConduitMode.DEPOSIT,
    salt,
    data: '0x' as const,
  }

  const hash = await walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [query, receiver],
    account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })
  if (receipt.status === 'reverted') {
    throw new Error('Deposit transaction reverted')
  }

  return { transactionHash: hash }
}
