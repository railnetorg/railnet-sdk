---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Removed `buildEnableConduitCall` and `EnableConduitParameters`, deprecated in 0.8.0.
It built `conduit.enable()`, which reverts `InvalidCaller` for every sender but the
ConduitFactory ([#89](https://github.com/railnetorg/railnet-sdk/pull/89)).

```diff
- const call = buildEnableConduitCall({ conduit })
+ const call = buildEnableConduitTransfersCall({ conduit })
```

- Take that migration only if `InvalidCaller` is what you were getting. The two are different
  selectors, and `enableTransfers()` is a one-way latch on holder transfers.
- Enabling a conduit stays the factory's job, reached through
  [`buildFinalizeConduitDepositCall`](https://sdk.railnet.org/actions/buildFinalizeConduitDepositCall)
  once the seed deposit settles.
