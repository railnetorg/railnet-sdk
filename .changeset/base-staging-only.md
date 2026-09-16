---
'@railnetorg/railnet-sdk': patch
---

Fixed `getAddresses(8453)` resolving silently ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)). The root entry point holds production
deployments only and Base has none, but the supported-chains table still listed it, so a caller got
staging addresses under the name of production.

- It throws now. Base lives at `@railnetorg/railnet-sdk/staging`.
