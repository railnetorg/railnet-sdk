import type { Abi, Account, Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import type { ContractCallOptions } from '../types.js'

export type PreparedCall = {
  address: Address
  abi: Abi | readonly unknown[]
  functionName: string
  args?: readonly unknown[] | undefined
}

/**
 * Simulates on the app's transport and signs with the wallet, the split wagmi's own
 * `simulateContract` and `writeContract` keep. A wallet provider serves reads from whatever node
 * it chooses at whatever freshness it chooses, so a preflight sent there can reject a call on
 * state that has already changed — and the declared chain still reaches the wallet, where viem
 * asserts it against the live `eth_chainId`.
 */
export async function simulateThenWrite(
  clients: { publicClient: Client; walletClient: Client },
  call: PreparedCall,
  account: Address | Account,
  options?: ContractCallOptions,
): Promise<Hash> {
  const { publicClient, walletClient } = clients

  const { request } = await simulateContract(publicClient, {
    ...options,
    ...call,
    account,
    chain: walletClient.chain,
  } as never)

  return writeContract(walletClient, request as never)
}
