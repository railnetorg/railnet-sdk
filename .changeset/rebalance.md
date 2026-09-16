---
'@railnetorg/railnet-sdk': minor
---

Added `buildRebalanceRedeemCall`, which redeems a position out of one sub-vehicle and stages the
proceeds in another's sector as a single `multicall` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- A rebalance is two transactions. Deposit the staged proceeds with `buildDispatchVehicleCall`, as
  a `DEPOSIT` of `maxUint256` settling into `SECTOR_ALLOCATION`.
- Thread one `operationId` through both, so the events stitch back into a single rebalance.
- `shares` is the exact amount redeemed, so an abandoned rebalance's leftovers in the source sector
  are never swept into the next one.
- `minOutput` is optional and defaults to none. It binds because the amount is pinned: the
  engine rejects a floor on a sentinel amount with `MinOutputRequiresPinnedAmount`.
