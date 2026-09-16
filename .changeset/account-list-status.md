---
'@railnetorg/railnet-sdk': minor
---

Added `getAccountListStatus`, which returns every verdict an AccountList holds on one account in a
single multicall ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- The SDK validated allow- and block-list batches client-side but could not answer whether an
  account may deposit before sending, which is what `CreateNotAllowed` was being used for.
- The three raw flags come back alongside the verdicts, because which one is false decides whether
  to unblock, to allow-list, or to do nothing on a sanctions hit.
- `canRedeem` passes for a blocked holder: sanctions alone gate an exit.
- On `railnetActions`.
