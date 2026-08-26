---
"@railnetorg/railnet-sdk": minor
---

Add the SectorAccountingEngine primitives an asset manager needs to reallocate, now that the contracts replaced `rebalance()` with a composable `move` + `dispatch` API.

- The `Sector` type with the five static sector constants (`SECTOR_AVAILABLE`, `SECTOR_ALLOCATION`, `SECTOR_RESERVED`, `SECTOR_ENTRY`, `SECTOR_EXIT`) and the `vehicleSector` / `sectorToVehicle` / `isVehicleSector` helpers. A vehicle sector is `0x01` followed by eleven zero bytes and the address; the static ones are ASCII right-aligned in a `bytes32`. Neither is reproducible by hand from an ABI.
- `moveBetweenSectors` for `SectorAccountingEngine.move` and `dispatchVehicle` for its `dispatch`, each with a `prepare*` builder.
- `simulateDispatchVehicle`, which sends nothing and returns the query plus the state the dispatch would reach — the only exact way to know whether a leg settles in one transaction or leaves an async vehicle in `PROCESSING`.
- `prepareDispatchVehicle` rejects `minOutput` combined with an `amount` of `maxUint256` up front, which the engine rejects as `MinOutputRequiresPinnedAmount`.
- Export the shared `Query` type, previously inlined in `processConduitQuery`.
