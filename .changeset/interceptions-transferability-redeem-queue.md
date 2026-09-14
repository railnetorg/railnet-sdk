---
'@railnetorg/railnet-sdk': minor
---

Close the last of the reachable surface the SDK left out.

- `buildSetConduitInterceptionsCall` and `buildSetVehicleInterceptionsCall` rewrite reward routing
  after deployment. Interceptions were settable at spawn through `initialInterceptions` and never
  again. `assertInterceptions` checks each entry's shares against the 10000 bps ceiling before the
  call is assembled — a ceiling, not an exact total as a fee split requires, so a shortfall is legal.
- `getTransferability` reads `conduit.isTransferable(from, to)`, the composed transfer policy. The
  conduit exposes no `transferEnabled` flag on its own, so this was the only unreachable way to ask
  whether a transfer would go through.
- `buildFeedQueryRedeemQueueCall` and `buildRetrieveQueryRedeemQueueAssetsCall` cover the two
  operator calls on the redeem queue. `feed` skips the `minSharesForAutoFulfill` threshold, so it is
  how a queue below that floor gets served; `retrieve` deposits without minting, which raises the
  per-share rate for every holder.

`getTransferability` is on `railnetActions`.
