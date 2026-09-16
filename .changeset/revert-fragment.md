---
'@railnetorg/railnet-sdk': patch
---

Fixed `getRailnetError` returning `null` for a revert raised by a different contract in the same
transaction ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)). `protocolErrorsAbi` carried 16 errors; viem decodes against the ABI of the call,
so the rest arrived as raw bytes.

- `buildSpawnConduitCall` could not decode `AssetNotAuthorized`, the most common spawn failure.
- `buildSpawnAaveV3VehicleCall` could not decode the reserve checks its facet runs at initialization.
- `estimateVehicle` decoded nothing at all: `baseVehicleAbi` ships no error entries.
- The fragment now holds the 167 names hangar declares, 169 entries because two exist in two
  signatures. Selectors are unique across the set, so the fallback cannot mis-attribute a revert.
