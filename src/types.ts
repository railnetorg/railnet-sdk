import type { AccessList, Hex, StateOverride } from 'viem'

export type ContractCallOptions = {
  gas?: bigint
  nonce?: number
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  accessList?: AccessList
  stateOverride?: StateOverride
  dataSuffix?: Hex
}
