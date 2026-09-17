import type { Address } from 'viem'

/** Fee rates in basis points. 10000 bps = 100%. */
export type Fees = {
  performanceFeeBps: number
  managementFeeBps: number
  depositFeeBps: number
  redeemFeeBps: number
}

/**
 * One share of the collected fees. The FeeManager requires a non-zero `target` (`ZeroAddress`) and
 * `shareBps` (`ZeroValue`), and a list that is non-empty (`ZeroLength`), sorted strictly ascending
 * by `target` (`RecipientsNotStrictlyAscending`) and summing to exactly 10000 (`InvalidBpsValue`).
 */
export type FeeRecipient = {
  target: Address
  shareBps: number
}
