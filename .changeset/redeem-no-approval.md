---
"@railnetorg/railnet-sdk": patch
---

`redeemConduit` no longer sends an approval transaction. The conduit burns the caller's shares with an internal `_transfer` followed by `_burn`, which never consults an allowance, so the approval was always a wasted transaction and a wasted signature. Redeeming is now a single transaction.
