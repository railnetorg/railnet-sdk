---
"@railnetorg/railnet-sdk": patch
---

Raise the `viem` peer floor to `>=2.8.0`. Earlier 2.x releases do not export `StateOverride`, so the previous `>=2.0.0` allowed installs that could not build.
