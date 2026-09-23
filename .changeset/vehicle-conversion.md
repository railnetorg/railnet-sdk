---
'@railnetorg/railnet-sdk': minor
---

Added `getVehicleConversion`, which prices a vehicle's shares against its assets at the current
rate through `convert` ([#84](https://github.com/railnetorg/railnet-sdk/pull/84)).

- It applies ongoing fee dilution and ignores transactional fees, so the value is gross of the
  deposit or redeem fee a settled query would pay.
- Does not revert `InvalidInput` or `ZeroInputValue`, unlike `estimateVehicle`.
- On `railnetActions`.
