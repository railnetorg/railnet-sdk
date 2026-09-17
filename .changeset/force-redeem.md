---
'@railnetorg/railnet-sdk': minor
---

Added `buildForceRedeemCall`, which burns a blocked or sanctioned holder's shares and opens a redeem
query paid to them, without their signature ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- It does not complete the exit. Against an async vehicle the query is still `PROCESSING` when the
  transaction lands — read the id with `extractQueryIds` and settle it with
  `buildProcessConduitQueryCall`.
- The account list gates both sides: the holder must be sanctioned or block-listed, and the caller
  needs CONDUIT_FORCE_REDEEM. A clean holder cannot be ejected whatever the caller holds.
- The proceeds go to the holder, never to the caller.
