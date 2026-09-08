---
'@railnetorg/railnet-sdk': patch
---

Resync `conduitAbi` with the deployed Conduit.

The shipped ABI carried eleven entries the deployed implementation does not have: `init`, the eight
`*Initialized` events it emitted, and the `UninitializedFeeManager` and `ZeroCode` errors. Nothing
was missing in the other direction, so every call the SDK encodes was already correct — but
`conduitAbi` let a consumer encode `init` against a contract with no such selector.

The deployed ABI is a subset of what was shipped, so this is safe against both deployment
generations live on Base.
