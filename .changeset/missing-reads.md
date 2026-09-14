---
'@railnetorg/railnet-sdk': minor
---

Add the two reads the SDK's own flows needed and did not have.

- `getSectorBalance` reads what one accounting sector holds of one asset. The rebalance builders
  settle leg one's redeem into the destination vehicle's sector, and on an async source that only
  lands once the query progresses — without this read there was no way to know when leg two could
  be sent, so it went out blind.
- `getAccountListStatus` returns every verdict an AccountList holds on an account in one multicall:
  `canDeposit`, `canRedeem`, `canReceive`, plus the three raw flags and the mode. The SDK validated
  allow- and block-list batches client-side but could not answer "may this account deposit" before
  sending, which is what `CreateNotAllowed` and `NotAllowed` were being used for.

Both are on `railnetActions`.
