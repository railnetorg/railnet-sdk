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

const TOTAL_BPS = 10_000

/**
 * A 100% deposit or redeem fee cannot be reversed — `_reverseFee` would divide by zero — so the
 * FeeManager caps both at `BPS_MAX - 1`, on the ceilings as well as on the rates.
 */
const CEILINGS = {
  performanceFeeBps: TOTAL_BPS,
  managementFeeBps: TOTAL_BPS,
  depositFeeBps: TOTAL_BPS - 1,
  redeemFeeBps: TOTAL_BPS - 1,
} as const satisfies Record<keyof Fees, number>

/**
 * Checks a recipient list against what the FeeManager enforces, so a bad split fails where it was
 * assembled rather than as a revert. Addresses are compared lowercased: a checksummed address
 * sorts by case otherwise, and the contract orders them as `uint160`.
 *
 * @throws Error if the list is empty, out of order, or does not total 10000 bps
 */
export function assertFeeRecipients(recipients: readonly FeeRecipient[]): void {
  if (recipients.length === 0) {
    throw new Error('fee recipients must not be empty')
  }

  let total = 0
  let previous = ''

  for (const recipient of recipients) {
    if (!Number.isInteger(recipient.shareBps) || recipient.shareBps <= 0) {
      throw new Error(
        `fee recipient ${recipient.target} has shareBps ${recipient.shareBps}: it must be a positive integer`,
      )
    }

    const target = recipient.target.toLowerCase()
    if (target <= previous) {
      throw new Error(
        `fee recipients must be sorted strictly ascending by target: ${recipient.target} does not follow ${previous}`,
      )
    }
    previous = target
    total += recipient.shareBps
  }

  if (total !== TOTAL_BPS) {
    throw new Error(`fee recipient shares must total ${TOTAL_BPS} bps, got ${total}`)
  }
}

/**
 * Checks every rate sits inside the ceiling the contract enforces for it. The per-rate maximum a
 * FeeManager was spawned with is on chain, so {@link buildSetFeesCall} can still revert
 * `FeeTooHigh` on a rate that passes here.
 *
 * @throws Error if a rate is not an integer inside its ceiling
 */
export function assertFees(fees: Fees): void {
  for (const [name, ceiling] of Object.entries(CEILINGS) as Array<[keyof Fees, number]>) {
    const value = fees[name]
    if (!Number.isInteger(value) || value < 0 || value > ceiling) {
      throw new Error(`${name} must be an integer between 0 and ${ceiling}, got ${value}`)
    }
  }
}

/**
 * Checks a rate set against the ceilings it will be spawned with. `__FeeManager_init` applies
 * `initialMaxFees` and then runs `initialFees` through the same `_checkFee` as a later update, so
 * a spawn whose initial rate exceeds its own ceiling reverts `FeeTooHigh`.
 *
 * @throws Error if a rate is out of range, or above its matching ceiling
 */
export function assertFeesWithinMax(fees: Fees, maxFees: Fees): void {
  assertFees(fees)
  assertFees(maxFees)

  for (const name of Object.keys(CEILINGS) as Array<keyof Fees>) {
    if (fees[name] > maxFees[name]) {
      throw new Error(`${name} is ${fees[name]}, above its ceiling of ${maxFees[name]}`)
    }
  }
}
