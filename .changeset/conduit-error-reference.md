---
'@railnetorg/railnet-sdk': patch
---

Fixed two entries in the bundled conduit error reference that named the wrong contract ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- `InsufficientAllowance` is raised by the factories pulling a spawn's initial deposit. A conduit
  deposit short on allowance reverts with the token's own ERC-20 error instead.
- `VehicleNotAuthorized` comes from the multi vehicle's VehicleManager, not from a factory.
  `buildAuthorizeVehicleCall` is the fix.
