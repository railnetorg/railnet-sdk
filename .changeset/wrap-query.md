---
'@railnetorg/railnet-sdk': minor
---

Added `buildWrapQueryCall` and `getQueryClaim`, which mint an ERC-721 over a live conduit query and
read who holds the claim ([#55](https://github.com/railnetorg/railnet-sdk/pull/55)).

- Wrapping needs the caller to be the registered owner, the query to be live, and the conduit to
  allow the caller a transfer to itself.
- `wrap` clears the owner and sets a token id, so a zero owner means the token holder owns the
  claim or the registry never knew the query, depending on the flag. `getQueryClaim` reads all three
  at once.
- `unwrap` is keyed on `msg.sender` as the conduit namespace, so only the owning conduit can call
  it. There is no builder.
- Ships the `OwnerRegistry` ABI, generated from the hangar artifacts.
