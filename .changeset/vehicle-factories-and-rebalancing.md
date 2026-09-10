---
'@railnetorg/railnet-sdk': minor
---

Add the three remaining vehicle factories, and compose a rebalance.

**Vehicle factories** — `buildSpawnErc4626VehicleCall`, `buildSpawnMorphoBlueVehicleCall`,
`buildSpawnWrapperVehicleCall`, each with its `extract*VehicleAddress`. Only Aave V3 had one, so
four of the five deployed factories were unreachable. Each derives its asset from its target rather
than taking one: the ERC-4626 vehicle from the vault, the Morpho Blue one from the market, so
neither can be handed an asset the target disagrees with. The wrapper factory takes no
`initialExpectedSupply` — it still pulls a seed deposit, but enforces no floor on the shares minted.

**Morpho resolution** — `getMorphoBlueSingleton` and `getMorphoMarketAsset`. `spawn` reverts on any
`morpho` other than the factory implementation's own, so it is read rather than hardcoded; the
market's loan token is what a supplier deposits, and so is the vehicle's asset.

**Rebalancing** — `buildRebalanceLegOneCall` batches the move out of ALLOCATION and the source
redeem into one `multicall`: run as two transactions, an abandoned sequence leaves the shares
stranded in a staging sector. Its settled destination is the target's sector rather than AVAILABLE,
where the queue-strategy engine could re-allocate them mid-rebalance. `buildRebalanceLegTwoCall`
deposits what settled there, and stays separate because an asynchronous source only settles later —
poll the query rather than retrying blind. Both legs thread one `operationId` so the events stitch
back into a single rebalance.
