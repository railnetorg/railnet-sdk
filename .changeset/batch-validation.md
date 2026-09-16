---
'@railnetorg/railnet-sdk': patch
---

Fixed `buildRemoveFromAllowListCall` and `buildRemoveFromBlockListCall` running no client-side check
([#52](https://github.com/railnetorg/railnet-sdk/pull/52)). Their two `add` counterparts already did, so an empty batch spent gas on a no-op and a zero
address or a repeat reverted on chain.
