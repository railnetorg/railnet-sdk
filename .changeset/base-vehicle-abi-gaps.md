---
'@railnetorg/railnet-sdk': minor
---

Added `interceptions`, `executeModule` and `multicall` to `baseVehicleAbi`. All three are on the
deployed BaseVehicle and were absent from the export, so encoding a call to any of them against a
vehicle threw `AbiFunctionNotFoundError`.

- Verified byte-identical against `hangar/out/BaseVehicle.sol/BaseVehicle.json` at `1.0.0-27-gf617e5e2`.
- `conduitAbi` already carried `interceptions`; only the vehicle side was short.
