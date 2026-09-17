---
'@railnetorg/railnet-sdk': minor
---

Added the 167 error names the protocol declares to `protocolErrorsAbi` ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)). viem decodes a
revert against the ABI of the call, so an error raised by another contract in the same transaction
arrives as raw bytes.

- `buildSpawnConduitCall` reaches `AssetNotAuthorized`, raised by the AssetRegistry.
- `buildSpawnAaveV3VehicleCall` reaches the reserve checks its facet runs at initialization.
- `estimateVehicle` reaches both reverts `BaseVehicle.estimate` raises; `baseVehicleAbi` declares
  no errors of its own.
- 169 entries for 167 names: two exist in two signatures. Selectors are unique across the set, so
  the fallback cannot mis-attribute a revert.
