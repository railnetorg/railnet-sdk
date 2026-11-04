---
"@railnetorg/railnet-sdk": minor
---

Added `getMultiVehiclePositions`, which reads a MultiVehicle's AVAILABLE and RESERVED base assets and each active vehicle's `vehicleHoldings`, every read pinned to one block.
  - Iterates `activeVehicles()`, the set `totalAssets()` values, so a vehicle unauthorized with a query in flight keeps its holdings.
  - Names the five `vehicleHoldings` returns (`sharesAfterUnlocks` … `assetsBeforeCreates`) in a `VehicleHoldings` type.
  - `/react`: `useMultiVehiclePositions` and `multiVehiclePositionsQueryOptions`.

```ts
const { available, reserved, vehicles, blockNumber } = await getMultiVehiclePositions(client, {
  sectorAccountingEngine,
})
```
