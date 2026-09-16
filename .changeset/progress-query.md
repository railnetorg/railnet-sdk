---
'@railnetorg/railnet-sdk': minor
---

Added `buildProgressQueryCall`, which advances a dispatch that did not settle in its own transaction
([#55](https://github.com/railnetorg/railnet-sdk/pull/55)). `simulateDispatchVehicle` has been telling callers to keep the query for exactly this, with
nothing to reach.

- The engine keys a sub-query on a hash of its four fields, so a struct assembled by hand reverts
  `UnknownSubQuery` for one wrong byte. The builder takes the dispatch parameters and derives the
  rest.
- One call can chain several transitions, so the state it reaches is not necessarily the next one.
- `toSubQuery` is exported for anyone who wants the struct alone.
- Ships the `SubQueryEngine` ABI, generated from the hangar artifacts.
