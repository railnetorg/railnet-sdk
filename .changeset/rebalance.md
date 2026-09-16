---
'@railnetorg/railnet-sdk': minor
---

Added `buildRebalanceRedeemCall`, which redeems a position out of one sub-vehicle and stages the
proceeds in another's sector, as a single `multicall` of a move and a dispatch ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- Sent as two transactions and abandoned in between, the shares would sit in the source's staging
  sector, out of `SECTOR_ALLOCATION` and earning nothing.
- The proceeds settle into the destination's sector, not `SECTOR_AVAILABLE`, where the queue
  strategy engine could re-allocate them mid-rebalance.
- Depositing them is a second transaction: an asynchronous source only settles once its query
  progresses. Dispatch a `DEPOSIT` of `maxUint256` from that sector with
  `buildDispatchVehicleCall`.
- `operationId` is echoed in both events, so the two halves stitch back into one rebalance.
