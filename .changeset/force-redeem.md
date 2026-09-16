---
'@railnetorg/railnet-sdk': minor
---

Added `buildForceRedeemCall`, the off-boarding path the AccountList documentation already pointed at
with no builder to reach it ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- The account list gates both sides: the holder must be sanctioned or block-listed, and the caller
  needs CONDUIT_FORCE_REDEEM. A clean holder cannot be ejected whatever the caller holds.
- The proceeds go to the holder, never to the caller.
