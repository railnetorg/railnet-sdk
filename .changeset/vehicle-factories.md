---
'@railnetorg/railnet-sdk': minor
---

Added the three remaining vehicle factories — `buildSpawnErc4626VehicleCall`,
`buildSpawnMorphoBlueVehicleCall` and `buildSpawnWrapperVehicleCall`, each with its
`extract*VehicleAddress`. Only Aave V3 had one, so four of the five deployed factories were
unreachable.

- Each derives its asset from its target rather than taking one: the ERC-4626 vehicle from the
  vault, the Morpho Blue one from the market. Neither can be handed an asset the target disagrees
  with.
- The wrapper factory takes no `initialExpectedSupply`. It still pulls a seed deposit, but enforces
  no floor on the shares minted.
- Added `getMorphoBlueSingleton` and `getMorphoMarketAsset`. `spawn` reverts on any `morpho` other
  than the factory implementation's own, so it is read rather than hardcoded; the market's loan
  token is what a supplier deposits, and so is the vehicle's asset.
