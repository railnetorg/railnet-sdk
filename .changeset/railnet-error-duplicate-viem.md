---
'@railnetorg/railnet-sdk': patch
---

Fixed `getRailnetError` returning `null` when the error came from another copy of viem. It matched
with `instanceof` against the SDK's own viem classes, and now matches the error's `name`.
