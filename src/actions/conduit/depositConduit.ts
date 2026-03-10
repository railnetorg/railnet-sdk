import {
  type Address,
  type Chain,
  erc20Abi,
  type Hash,
  type Hex,
  keccak256,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import { ConduitMode } from './types.js'

export type DepositConduitParameters = {
  conduit: Address
  token: Address
  amount: bigint
  receiver?: Address
  salt?: Hex
}

export async function depositConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: DepositConduitParameters & { account: Address },
): Promise<Hash> {
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
    await waitForTransactionReceipt(walletClient, { hash: approveHash })
  }

  const query = {
    owner: conduit,
    receiver: conduit,
    input: [{ asset: token, value: amount }],
    output: [],
    mode: ConduitMode.DEPOSIT,
    salt,
    data: '0x' as const,
  }

  return walletClient.writeContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [query, receiver],
    account,
    chain: walletClient.chain,
  })
}
