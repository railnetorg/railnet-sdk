---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Keyed `railnetErrorHints` by `ProtocolErrorName`, the union of every custom error the shipped ABIs declare. Indexing it with an arbitrary `string` no longer compiles.

- `getRailnetError` resolves the hint itself and is unaffected.
- So are `Object.entries(railnetErrorHints)` and static access like `railnetErrorHints.MissingRole`.
- `ProtocolErrorName` is exported, for narrowing a name yourself.

```diff
- const hint = railnetErrorHints[errorName]
+ const hint = getRailnetError(error)?.hint
```
