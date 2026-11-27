---
"@railnetorg/railnet-sdk": minor
---

Added the Base (`8453`) production deployment to the root address book. `getAddresses(8453)` now returns it instead of throwing, and `isSupportedChain(8453)` returns `true`. `SupportedChainId` is now `1 | 8453`. The Base staging deployment stays behind `@railnetorg/railnet-sdk/staging`.
