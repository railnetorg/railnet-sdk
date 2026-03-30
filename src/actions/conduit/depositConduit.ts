import { type Address, type Client, erc20Abi, type Hash, type Hex, keccak256, toHex } from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
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
  publicClient: Client,
  walletClient: Client,
  parameters: DepositConduitParameters & { account: Address },
): Promise<Hash> {
  const { conduit, token, amount, account } = parameters
  const receiver = parameters.receiver ?? account
  const salt = parameters.salt ?? keccak256(toHex(`deposit-${account}-${Date.now()}`))

  const allowance = await readContract(publicClient, {
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, conduit],
  })

  if (allowance < amount) {
    const { request: approveRequest } = await simulateContract(publicClient, {
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [conduit, amount],
      account,
    })
    const approveHash = await writeContract(walletClient, approveRequest)
    await waitForTransactionReceipt(publicClient, { hash: approveHash })
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

  const { request: depositRequest } = await simulateContract(publicClient, {
    address: conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [query, receiver],
    account,
  })

  return writeContract(walletClient, depositRequest)
}
