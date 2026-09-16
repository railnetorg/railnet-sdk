---
'@railnetorg/railnet-sdk': minor
---

Added `getSectorBalance`, which reads what one accounting sector holds of one asset ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). It is
what makes the two-transaction rebalance drivable.

- `buildRebalanceRedeemCall` settles into the destination vehicle's sector, and on an asynchronous
  source that only lands once the query progresses. The deposit that follows had no way to know
  when, so it went out blind.
- A share sector is read with the sub-vehicle's own address as `asset`.
- On `railnetActions`.
