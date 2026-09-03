import type { Abi, AccessList, Address, Chain, Hex, StateOverride } from 'viem'

export type PreparedWrite = {
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
}

export type ContractCallOptions = {
  /** Chain the call is meant for. viem rejects it against the wallet's live chain. */
  chain?: Chain
  gas?: bigint
  nonce?: number
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  accessList?: AccessList
  stateOverride?: StateOverride
  dataSuffix?: Hex
}
