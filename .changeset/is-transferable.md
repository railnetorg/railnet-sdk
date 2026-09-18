---
'@railnetorg/railnet-sdk': minor
---

Added `getIsTransferable`, which asks a conduit whether it would let one address send shares to
another ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- It takes a pair: the same conduit is transferable for one pair and not another.
- The same predicate gates wrapping a query in the OwnerRegistry.
- On `railnetActions`.
