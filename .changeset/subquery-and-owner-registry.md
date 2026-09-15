---
'@railnetorg/railnet-sdk': minor
---

Ship the SubQueryEngine and OwnerRegistry ABIs, and the two actions that needed them.

- `buildProgressQueryCall` advances a dispatch that did not settle in its own transaction — what
  `simulateDispatchVehicle` has been telling callers to keep the query for, with nothing to reach.
  It assembles the `SubQuery` from the dispatch parameters and derives its `queryId` with
  `toQueryId`, so a caller never hand-builds a struct whose id has to match to the bit. `toSubQuery`
  is exported for anyone who wants the struct alone.
- `buildWrapQueryCall` mints the ERC-721 over a live query, and `getQueryClaim` reads who holds the
  claim and whether it is wrapped yet. The SDK spawned an OwnerRegistry and documented wrapping
  without shipping the ABI to do it.

Both ABIs are generated from the hangar artifacts and verified identical to them. No `unwrap`
builder: it is keyed on `msg.sender` as the conduit namespace, so only the owning conduit can reach
it.
