import type { Address } from 'viem'

/** Fee rates in basis points. 10000 bps = 100%. */
export type Fees = {
  performanceFeeBps: number
  managementFeeBps: number
  depositFeeBps: number
  redeemFeeBps: number
}

/**
 * One share of the collected fees. `shareBps` must be non-zero, and a recipient list must be
 * sorted strictly ascending by `target` and sum to exactly 10000 — the FeeManager reverts
 * `RecipientsNotStrictlyAscending` and `InvalidBpsValue` otherwise.
 */
export type FeeRecipient = {
  target: Address
  shareBps: number
}
