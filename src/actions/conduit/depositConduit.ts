import {
  type Address,
  type Chain,
  erc20Abi,
  type Hash,
  type Hex,
  keccak256,
  type PublicClient,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
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
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: DepositConduitParameters & { account: Address },
): Promise<Hash> {
  const { conduit, token, amount, account } = parameters
  const receiver = parameters.receiver ?? account
  const salt = parameters.salt ?? keccak256(toHex(`deposit-${account}-${Date.now()}`))

  const allowance = await publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < amount) {
    const { request: approveRequest } = await publicClient.simulateContract({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [conduit, amount],
      account,
    })
    const approveHash = await walletClient.writeContract(approveRequest)
    await publicClient.waitForTransactionReceipt({ hash: approveHash })
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

  const { request: depositRequest } = await publicClient.simulateContract({
    address: conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [query, receiver],
    account,
  })

  return walletClient.writeContract(depositRequest)
}
