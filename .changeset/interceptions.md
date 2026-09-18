---
'@railnetorg/railnet-sdk': minor
---

Added `buildSetConduitInterceptionsCall` and `buildSetVehicleInterceptionsCall`, which rewrite
reward routing after deployment ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). Interceptions were settable at spawn and never again.

- `assertInterceptions` checks an entry's shares against the 10000 bps ceiling before the call is
  assembled. It is a ceiling, not an exact total as a fee split requires, so a shortfall is legal.
- The ceiling is per entry, not across assets.
- The rules are read by off-chain distribution, so a wrong list misroutes a reward without
  reverting.
