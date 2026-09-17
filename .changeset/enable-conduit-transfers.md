---
'@railnetorg/railnet-sdk': minor
---

Added `buildEnableConduitTransfersCall`, which builds `conduit.enableTransfers()`, and deprecated
`buildEnableConduitCall` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

```diff
- const call = buildEnableConduitCall({ conduit })
+ const call = buildEnableConduitTransfersCall({ conduit })
```

- Not a rename. `buildEnableConduitCall` builds `conduit.enable()`, a different selector that
  accepts the ConduitFactory alone and reverts `InvalidCaller` for anyone else — it calls it once
  the seed deposit settles.
- Take the migration above only if that revert is what you were getting. `enableTransfers()` is a
  one-way latch on holder transfers, and no call turns it back off.
- `buildEnableConduitCall` is removed in 0.9.0.
