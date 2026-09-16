---
'@railnetorg/railnet-sdk': patch
---

Fixed `buildSetFeeRecipientsCall` and `buildSpawnFeeManagerCall` accepting a zero-address fee
recipient, which the FeeManager rejects through `CheckLib.checkAddress`. The split now fails where
it is assembled, as the other recipient invariants already did.
