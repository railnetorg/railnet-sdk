---
'@railnetorg/railnet-sdk': minor
---

Added `buildFeedQueryRedeemQueueCall` and `buildRetrieveQueryRedeemQueueAssetsCall`, the two
operator overrides on a MultiVehicle's redeem queue ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- `buildFeedQueryRedeemQueueCall` skips the `minSharesForAutoFulfill` threshold auto-fulfillment has
  to cross, so a queue below that floor can still be served.
- `buildRetrieveQueryRedeemQueueAssetsCall` deposits without minting, which raises the per-share
  rate for every holder.
