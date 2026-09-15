---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Call builders now throw on input the contracts reject, instead of encoding a call
that reverts on chain.

- A fee split that is empty, out of order, or short of 10000 bps.
- A rate above its ceiling: `depositFeeBps` and `redeemFeeBps` cap at 9999, not 10000.
- `sanctionsEnabled` without an oracle.
- A zero address or a duplicate in an allow- or block-list batch.
- `buildSpawnFeeManagerCall` checks `initialFees` against `initialMaxFees`.

Added `assertFeeRecipients` and `assertFees` to validate a split before building. `buildSpawnConduitCall`
and `predictConduitDeployment` now share one `SpawnParams` mapping, so a prediction cannot drift from
the call it predicts.
