import type { Address, Hex } from 'viem'

export type Interception = {
  asset: Address
  recipients: Array<{
    target: Address
    shareBps: bigint
    chainId: bigint
  }>
}

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
  querySalt?: Hex
  deploymentSalt?: Hex
}

export enum ConduitMode {
  DEPOSIT = 0,
  REDEEM = 1,
}

export enum ConduitState {
  EMPTY = 0,
  PROCESSING = 1,
  PAUSED = 2,
  UNLOCKING = 3,
  RECOVERING = 4,
  REJECTED = 5,
  SETTLED = 6,
}

export type Asset = {
  asset: Address
  value: bigint
}
