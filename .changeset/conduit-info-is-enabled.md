---
"@railnetorg/railnet-sdk": minor
---

`getConduitInfo` now returns `isEnabled`, read from `conduit.ready()` in the same multicall. The field was documented on the `ConduitInfo` type but never returned, so callers had no way to tell a live conduit from a disabled one — and `ready()` is the gate that decides whether deposits and redeems are possible at all.
