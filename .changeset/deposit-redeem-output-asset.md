---
"@railnetorg/railnet-sdk": minor
---

Deposits and redeems name a valid output asset, so they stop reverting. `BaseVehicle._validateOutput` reverts unless a DEPOSIT names the vehicle as its output asset and a REDEEM names the underlying, and the SDK passed the zero address for both.

`depositConduit` now reads `conduit.getVehicle()` (skipped when you pass `vehicle`) and `redeemConduit` reads `conduit.asset()` (skipped when you pass `outputAsset`), both alongside the allowance read they already did. The pure builders cannot derive either address, so `prepareDepositConduit` requires `vehicle` and `prepareRedeemConduit` requires `outputAsset`.
