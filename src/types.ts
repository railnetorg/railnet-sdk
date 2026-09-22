import type { Address, Hex } from 'viem'

/** An amount of one token. The protocol passes value and denomination together everywhere. */
export type Asset = {
  asset: Address
  value: bigint
}

/**
 * A share of one asset's flow, routed away at settlement. `shareBps` is in basis points of that
 * flow and `chainId` names where the target lives.
 */
export type Interception = {
  asset: Address
  recipients: Array<{
    target: Address
    shareBps: bigint
    chainId: bigint
  }>
}

/**
 * Direction of a STEAM query. Not conduit-specific: vehicles, the sector accounting engine and
 * the estimators all read the same enum.
 */
export enum QueryMode {
  DEPOSIT = 0,
  REDEEM = 1,
}

/** Which side of a query an estimate prices. */
export enum EstimationType {
  INPUT = 0,
  OUTPUT = 1,
}

/** Lifecycle of a STEAM query. `SETTLED` in one transaction means the vehicle is synchronous. */
export enum QueryState {
  EMPTY = 0,
  PROCESSING = 1,
  PAUSED = 2,
  UNLOCKING = 3,
  RECOVERING = 4,
  REJECTED = 5,
  SETTLED = 6,
}

/**
 * A STEAM query, the unit of work every deposit and redeem travels as. Its id is
 * {@link toQueryId} of this struct.
 */
export type Query = {
  owner: Address
  receiver: Address
  input: Asset
  output: Asset
  mode: QueryMode
  salt: Hex
  data: Hex
}
