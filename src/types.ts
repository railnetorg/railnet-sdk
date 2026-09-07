import type { Abi, AccessList, Address, Hex, StateOverride } from 'viem'

export type PreparedWrite = {
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
}

export type ContractCallOptions = {
  gas?: bigint
  nonce?: number
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  accessList?: AccessList
  stateOverride?: StateOverride
  dataSuffix?: Hex
}
