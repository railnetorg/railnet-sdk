/**
 * How the allow-list is consulted. Precedence across every predicate is sanctions, then block-list,
 * then this — and redeem is gated by sanctions alone, so a blocked holder can always exit.
 */
export enum AllowlistMode {
  /** Allow-list ignored: anyone not blocked or sanctioned may deposit and transfer. */
  OPEN = 0,
  /** Allow-list gates deposits only. Transfers stay open to non-blocked parties. */
  REGULAR = 1,
  /** Allow-list gates deposits and transfers, and both sides of a transfer must be listed. */
  STRICT = 2,
}
