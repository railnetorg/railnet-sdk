---
"@railnetorg/railnet-sdk": minor
---

Added an optional `blockNumber` to every read of contract state, so reads can be lined up on one block or served from a past one.
  - `estimateConduit`, `estimateVehicle`, `getAccountListStatus`, `getConduitInfo`, `getConduitInterceptions`, `getVehicleInterceptions`, `getHasRole`, `getInitialDepositAmount`, `getIsTransferable`, `getPendingDefaultAdmin`, `getQueryClaim`, `getQueryState`, `getSectorBalance`, `getVehicleConversion`, `getVehicleManagerLimits`.
  - Not on immutable reads, `predict…Deployment`, `getDepositConduitCall`, `getRedeemConduitCall` or `simulateDispatchVehicle`.
  - The `/react` hooks and query options take it too; a pinned read caches under its own key.
