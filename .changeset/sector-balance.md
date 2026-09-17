---
'@railnetorg/railnet-sdk': minor
---

Added `getSectorBalance`, which reads what one accounting sector holds of one asset ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).

- `buildRebalanceRedeemCall` settles into the destination vehicle's sector, and on an asynchronous
  source that lands only once the query progresses. Poll here before dispatching the deposit that
  follows.
- A share sector is read with the sub-vehicle's own address as `asset`.
- On `railnetActions`.
