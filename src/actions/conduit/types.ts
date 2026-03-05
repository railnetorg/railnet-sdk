import type { Address, Hash, Hex } from 'viem'

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

export type ConduitPosition = {
  shares: bigint
  assets: bigint
  conduit: Address
  account: Address
}

export type ConduitInfo = {
  conduit: Address
  asset: Address
  totalSupply: bigint
  totalAssets: bigint
  holdings: bigint
  decimals: number
  name: string
  symbol: string
  isEnabled: boolean
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

export enum EstimationType {
  INPUT = 0,
  OUTPUT = 1,
}

export type Asset = {
  asset: Address
  value: bigint
}

export type DepositConduitParameters = {
  conduit: Address
  token: Address
  amount: bigint
  receiver?: Address
  salt?: Hex
}

export type DepositConduitReturnType = {
  transactionHash: Hash
}

export type RedeemConduitParameters = {
  conduit: Address
  shares: bigint
  receiver?: Address
  outputAssets?: Asset[]
  salt?: Hex
}

export type RedeemConduitReturnType = {
  transactionHash: Hash
}

export type ProcessConduitQueryParameters = {
  conduit: Address
  query: {
    owner: Address
    receiver: Address
    input: Asset[]
    output: Asset[]
    mode: ConduitMode
    salt: Hex
    data: Hex
  }
}

export type ProcessConduitQueryReturnType = {
  transactionHash: Hash
}

export type EstimateConduitParameters = {
  conduit: Address
  assets: Asset[]
  mode: ConduitMode
  estimationType: EstimationType
}
