---
'@railnetorg/railnet-sdk': patch
---

Fixed the `InsufficientAllowance` hint, which sent callers to approve a conduit for an error only
the factories raise. `FactoryLib.validateDepositRequirements` is the sole source; a conduit deposit
short on allowance reverts with the ERC-20 error of the token, which carries its own name.

- `VehicleNotAuthorized` is raised by `VehicleManager`, not by a factory. The conduit error
  reference said otherwise and now names `buildAuthorizeVehicleCall` as the fix.
