---
'@railnetorg/railnet-sdk': minor
---

Added the remaining twelve read actions to the `railnetActions` decorator, which held four ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- Its type is derived from the exports rather than listed by hand, so a read added later cannot be
  left off.
- Writes stay absent by design: the SDK builds calls and the caller sends them.
