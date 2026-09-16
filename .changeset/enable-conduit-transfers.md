---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Renamed `buildEnableConduitCall` to `buildEnableConduitTransfersCall`, which is the
call it already built ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

```diff
- const call = buildEnableConduitCall({ conduit })
+ const call = buildEnableConduitTransfersCall({ conduit })
```

- The old name suggested it enabled the conduit. `conduit.enable()` takes the ConduitFactory alone,
  which calls it once the seed deposit settles.
- A one-way latch either way: no call turns transfers back off.
