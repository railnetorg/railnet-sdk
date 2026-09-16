---
'@railnetorg/railnet-sdk': minor
---

Added the three remaining vehicle factories, each with the receipt helper that reads its deployed
address back ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)). Only Aave V3 had one.

- `buildSpawnErc4626VehicleCall` and `buildSpawnMorphoBlueVehicleCall` derive the asset from their
  target rather than taking one, so neither can be handed an asset the vault or market disagrees
  with.
- `buildSpawnWrapperVehicleCall` takes no `initialExpectedSupply`. It still pulls a seed deposit,
  but enforces no floor on the shares minted.
- Added `getMorphoBlueSingleton`: `spawn` reverts on any `morpho` other than the factory
  implementation's own, so it is read rather than hardcoded.
- Added `getMorphoMarketAsset`. The market's loan token is what a supplier deposits, and so is the
  vehicle's asset.
