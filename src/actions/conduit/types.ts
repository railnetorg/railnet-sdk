import type { Address, Hex } from 'viem'
import type { Interception } from '../../types.js'

export type SpawnConduitParameters = {
  factory: Address
  name: string
  symbol: string
  vehicle: Address
  initialExpectedSupply: bigint
  transferEnabled: boolean
  initialInterceptions?: Array<Interception>
  accessControl: Address
  feeManager: Address
  accountList: Address
  ownerRegistry: Address
  querySalt: Hex
  deploymentSalt: Hex
}
