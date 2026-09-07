import type { Abi, Account, Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'

export type PreparedCall = {
  address: Address
  abi: Abi | readonly unknown[]
  functionName: string
  args?: readonly unknown[] | undefined
}

export async function simulateThenWrite(
  clients: { publicClient: Client; walletClient: Client },
  call: PreparedCall,
  account: Address | Account,
): Promise<Hash> {
  const { publicClient, walletClient } = clients

  const { request } = await simulateContract(publicClient, {
    ...call,
    account,
    chain: walletClient.chain,
  } as never)

  return writeContract(walletClient, request as never)
}
