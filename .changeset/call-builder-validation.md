---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Changed the call builders to throw on input the contracts reject, rather than encode
a call that reverts on chain ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- A fee split that is empty, out of order, or short of 10000 bps.
- A rate above its ceiling. `depositFeeBps` and `redeemFeeBps` cap at 9999, not 10000.
- `sanctionsEnabled` set without an oracle.
- An empty batch, a zero address or a duplicate, adding to or removing from either account list.
- `initialFees` above the matching `initialMaxFees` at spawn.
