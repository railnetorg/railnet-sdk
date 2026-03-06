import type { Address, Hex } from 'viem'

export enum TransferMode {
  ACCOUNT_LIST = 0,
  ALLOW_TRANSFER = 1,
  BLOCK_TRANSFER = 2,
}

export type SpawnConduitParameters = {
  factory: Address
  name: string
  symbol: string
  vehicle: Address
  depositAsset: Address
  initialDepositSize: bigint
  initialExpectedSupply: bigint
  transferMode: TransferMode
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
  WAITING = 2,
  UNLOCKING = 3,
  RECOVERING = 4,
  REJECTED = 5,
  SETTLED = 6,
}

export type Asset = {
  asset: Address
  value: bigint
}
