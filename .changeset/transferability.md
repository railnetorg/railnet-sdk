---
'@railnetorg/railnet-sdk': minor
---

Added `getTransferability`, which asks a conduit whether it would let one address send shares to
another ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). The conduit exposes no `transferEnabled` flag, so the composed policy was
unreadable.

- It takes a pair, because the answer is not a property of the conduit.
- The same predicate gates wrapping a query in the OwnerRegistry.
- On `railnetActions`.
