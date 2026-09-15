---
'@railnetorg/railnet-sdk': patch
---

Fixed `getAddresses(8453)` silently resolving: the root entry point holds production deployments
only and Base has none, but the supported-chains table still listed it, so a caller got staging
addresses under the name of production. It throws now. Base lives at
`@railnetorg/railnet-sdk/staging`.
