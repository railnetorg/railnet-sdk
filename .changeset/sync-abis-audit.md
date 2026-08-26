---
"@railnetorg/railnet-sdk": minor
---

Resync all ten ABIs from the audited contracts (the audit-remediation branch), which supersedes the hand-scalarised subset and brings the rest of that branch with it.

- **`conduitFactory.spawn` takes one argument, not two.** `deploymentSalt` is a field of `SpawnParams`; the SDK also passed it positionally, which produced a different selector and made conduit deployment impossible. `prepareSpawnConduit` now sends `[spawnParams]`.
- `vehicleManager`: the `Route` struct in `IncompatibleVehicle` was `(address[], address[])[]` instead of `(address, address)[]`, so that revert decoded as an unknown error.
- Adds the errors the SDK could not decode: `ZeroInputValue`, `InvalidInput`, `UnknownQuery`, `InterceptionSharesTooHigh`, and renames `InvalidEstimatedAssets` to `InvalidEstimatedAsset`.
- Adds `SectorAccountingEngine.activeVehicles`, and `VEHICLE_PROCESS_QUEUE` to the role constants (36 roles).
- The three factory `spawn` entrypoints are `nonpayable`, so they can no longer trap ETH.
