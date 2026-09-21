# Multi-Vehicle Reference

Parameters, roles and reverts per action. The patterns live in `../SKILL.md`; this file is lookup
only. Every role is scoped to the contract named in the Target column, not to the multi vehicle.

---

## Deployment

### `buildSpawnMultiVehicleCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `factory` | `Address` | `getAddresses(chainId).multiVehicleFactory` |
| `asset` | `Address` | The multi vehicle's base asset |
| `name` | `string` | |
| `symbol` | `string` | |
| `accessControl` | `Address` | |
| `queryRegistry` | `Address` | |
| `feeManager` | `Address?` | Defaults to the zero address |
| `modulesManager` | `Address?` | Defaults to the zero address |
| `forbiddenAddresses` | `Address[]?` | Defaults to empty |
| `salts` | `MultiVehicleSalts` | Seven salts, see below |
| `initialInterceptions` | `Interception[]?` | Defaults to empty |

```typescript
type MultiVehicleSalts = {
  multiVehicle: Hex
  queryRedeemQueue: Hex
  queueStrategyEngine: Hex
  sectorAccountingEngine: Hex
  subQueryEngine: Hex
  vehicleManager: Hex
  initialDepositQuery: Hex
}
```

Six of the seven salt a deployment. `initialDepositQuery` salts the seed deposit's query.

`extractMultiVehicleContracts(receipt, factoryAddress)` returns `MultiVehicleContracts` or `null`:
`multiVehicle`, `queryRedeemQueue`, `queueStrategyEngine`, `sectorAccountingEngine`,
`subQueryEngine`, `vehicleManager`.

---

## VehicleManager

| Function | Parameters | Role | Target |
| --- | --- | --- | --- |
| `buildAuthorizeVehicleCall` | `{ vehicleManager, vehicle }` | MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION | VehicleManager |
| `buildUnauthorizeVehicleCall` | `{ vehicleManager, vehicle }` | MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION | VehicleManager |
| `buildConfigureVehicleCall` | `{ vehicleManager, vehicle, config }` | MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION | VehicleManager |
| `buildSetThresholdsCall` | `{ vehicleManager, thresholds }` | MULTI_VEHICLE_SET_THRESHOLDS | VehicleManager |
| `buildSetMaxTotalAssetsCall` | `{ vehicleManager, maxTotalAssets }` | MULTI_VEHICLE_SET_THRESHOLDS | VehicleManager |
| `buildFeedQueryRedeemQueueCall` | `{ vehicleManager }` | MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE | VehicleManager |
| `buildRetrieveQueryRedeemQueueAssetsCall` | `{ vehicleManager, amount }` | MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS | VehicleManager |

### `VehicleConfig`

```typescript
const VehicleMode = { Automatic: 0, Manual: 1 } as const

type VehicleCap = { value: bigint; threshold: bigint }
type VehicleConfig = { mode: VehicleMode; cap: VehicleCap }
```

`cap.value` is in the sub-vehicle's share units, 18 decimals. `2n ** 256n - 1n` is unlimited, and
`threshold` is then ignored but stored as passed, so send 0. On a finite cap `threshold` must not
exceed `value`.

`Manual` keeps the queue strategy from allocating into the vehicle, leaving it to operator
dispatches.

Reverts: `VehicleNotAuthorized` on a vehicle never authorized, `InvalidTarget` when a finite cap
carries `threshold > value`, `StateUnchanged` when mode and cap already hold.

`buildUnauthorizeVehicleCall` drops authorization and configuration but does not unwind holdings.

### `VehicleThresholds`

| Field | Units | Notes |
| --- | --- | --- |
| `minSharesForAutoFulfill` | vehicle shares, 18 decimals | `2n ** 256n - 1n` disables auto-fulfill and is where a fresh deployment starts. `0` auto-fulfills every request |
| `extraAssetsForWithdrawalRequests` | the multi vehicle's ASSET units | Buffer added on top of a requested redeem. Rejected above `type(uint128).max` |

Both are replaced together; there is no partial update.

`maxTotalAssets` is a hard cap on `totalAssets()` enforced at deposit time, in asset units.
`2n ** 256n - 1n` is uncapped. Operator flows that grow `totalAssets()` without minting shares are
exempt.

`getVehicleManagerLimits(client, { vehicleManager })` reads all three in one multicall.

### Redeem queue

`buildFeedQueryRedeemQueueCall` fulfills pending redeem requests out of the withdrawable balance and
reverts `NothingToFulfill` when none is redeemable against it.
`buildRetrieveQueryRedeemQueueAssetsCall` deposits `amount` into `SECTOR_AVAILABLE`.

---

## QueueStrategyEngine

### `buildSetQueuesCall({ queueStrategyEngine, depositQueue, redeemQueue })`

Role: MULTI_VEHICLE_SET_QUEUES, scoped to the engine.

```typescript
type QueueTarget = { value: bigint; threshold: bigint }
type QueueEntry = { vehicle: Address; target: QueueTarget }
```

Targets are in the sub-vehicle's share units. `2n ** 256n - 1n` is accepted on the deposit queue
only; an unlimited `value + threshold` on a redeem entry is rejected. `threshold` must not exceed
`value` on a finite target, or the call reverts `InvalidTarget`.

Entries are validated on chain and rejected with `InvalidQueueEntry(index, vehicle, reason)`.

| Queue | Requirements |
| --- | --- |
| Both | Vehicle ready, asset matching the engine's, mode other than `Manual` |
| Deposit | Authorized, with a non-zero `value` |
| Redeem | Single-asset vehicle, finite target |

---

## SectorAccountingEngine

### Sectors

| Constant | Value |
| --- | --- |
| `SECTOR_ENTRY` | `zeroHash` |
| `SECTOR_AVAILABLE` | `pad(toHex('available'), { size: 32 })` |
| `SECTOR_ALLOCATION` | `pad(toHex('allocation'), { size: 32 })` |
| `SECTOR_RESERVED` | `pad(toHex('reserved'), { size: 32 })` |
| `SECTOR_EXIT` | `0x00ff…ff` |

`vehicleSector(vehicle)` builds a vehicle's own sector: `0x01`, eleven zero bytes, then the address.
`isVehicleSector(sector)` tests one, `sectorToVehicle(sector)` decodes it back to an address or
`undefined` for a static sector.

### `buildMoveBetweenSectorsCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `sectorAccountingEngine` | `Address` | |
| `from` / `to` | `Sector` | |
| `asset` | `Address` | The base asset for an asset sector, the sub-vehicle's own address for a share sector |
| `amount` | `bigint` | |
| `operationId` | `Hex` | Echoed in events so an indexer can stitch the halves together |

Role: MULTI_VEHICLE_MOVE, scoped to the engine.

### `buildDispatchVehicleCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `sectorAccountingEngine` | `Address` | |
| `vehicle` | `Address` | |
| `mode` | `QueryMode` | DEPOSIT or REDEEM |
| `amount` | `bigint` | `maxUint256` dispatches the whole sector balance |
| `settledDestination` | `Sector` | |
| `rejectedDestination` | `Sector` | |
| `minOutput` | `bigint?` | Defaults to `0n` |
| `data` | `Hex?` | Defaults to `0x` |
| `operationId` | `Hex` | |

Role: MULTI_VEHICLE_DISPATCH, scoped to the engine.

Throws before encoding when `amount` is `maxUint256` and `minOutput` is non-zero: the engine rejects
that pair with `MinOutputRequiresPinnedAmount`.

`simulateDispatchVehicle(client, parameters & { account })` returns `{ query, state }` without
sending. The engine bubbles the vehicle's state up unchanged, so `state` is any `QueryState`.
`SETTLED` and `REJECTED` are terminal; a rejected query can never be progressed.

### `buildRebalanceRedeemCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `sectorAccountingEngine` | `Address` | |
| `from` | `Address` | Sub-vehicle the position leaves |
| `to` | `Address` | Sub-vehicle the proceeds are staged for. Must be authorized, or the engine's asset-sector check rejects it with `InvalidVehicleSector` |
| `shares` | `bigint` | Shares of `from`, 18 decimals |
| `minOutput` | `bigint?` | Floor on the assets the redeem must produce |
| `operationId` | `Hex` | |

Needs both MULTI_VEHICLE_MOVE and MULTI_VEHICLE_DISPATCH. Emits one `multicall` of a move and a
dispatch. Redeems exactly `shares`, so a request above what the sector holds reverts
`DispatchRedeemAmountTooHigh`.

Completing the rebalance is a second transaction: dispatch a DEPOSIT of `maxUint256` from the
destination's sector, settling into `SECTOR_ALLOCATION`.

### `getSectorBalance(client, { sectorAccountingEngine, sector, asset })`

Returns a `bigint` in the asset's own units. A vehicle sector holding shares is read with the
vehicle as `asset`.

---

## SubQueryEngine

### `buildProgressQueryCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `subQueryEngine` | `Address` | |
| `chainId` | `number` | |
| `vehicle` | `Address` | The sub-vehicle the dispatch targeted |
| `query` | `Query` | Exactly as `simulateDispatchVehicle` returned it |
| `settledDestination` | `Sector` | As the dispatch carried it |
| `rejectedDestination` | `Sector` | As the dispatch carried it |

Role: MULTI_VEHICLE_PROGRESS_QUERY, scoped to the SubQueryEngine.

Both destinations are part of the sub-query's id, so any difference from the dispatch reverts
`UnknownSubQuery`. A terminal sub-query reverts `SubQueryAlreadyFinalized`.

`toSubQuery(parameters)` returns the identifying struct on its own:
`{ vehicle, queryId, settledDestination, rejectedDestination }`, where `queryId` is
`toQueryId({ chainId, vehicle, query })`.

---

## Vehicle factories

All four share `accessControl`, `queryRegistry`, `querySalt`, `deploymentSalt`, and optional
`feeManager`, `modulesManager` and `forbiddenAddresses`. Role: FACTORY_SPAWN on the factory's access
control. Each pulls a seed deposit sized by the AssetRegistry.

| Builder | Asset parameters | `initialExpectedSupply` | Receipt extractor |
| --- | --- | --- | --- |
| `buildSpawnAaveV3VehicleCall` | `asset`, `poolAddressesProvider` | required | `extractAaveV3VehicleAddress` |
| `buildSpawnErc4626VehicleCall` | `vault` | required | `extractErc4626VehicleAddress` |
| `buildSpawnMorphoBlueVehicleCall` | `morpho`, `marketId` | required | `extractMorphoBlueVehicleAddress` |
| `buildSpawnWrapperVehicleCall` | `asset` | not taken | `extractWrapperVehicleAddress` |

`initialExpectedSupply` is a floor on the shares the seed deposit must mint, and the factory rejects
zero. The wrapper enforces no floor.

An ERC-4626 vehicle takes no asset: the vault's own asset is used, and the AssetRegistry has to
carry an initial deposit amount for it. A Morpho Blue vehicle's asset comes from the market, and
`morpho` must equal the factory implementation's `MORPHO` — read it with `getMorphoBlueSingleton`.
`getMorphoMarketAsset(client, { morpho, marketId })` resolves a market to its asset, and
`morphoMarketAbi` is exported for reading the market directly.

A wrapper vehicle holds the asset rather than supplying it anywhere, so it earns nothing and exists
to give a plain token a STEAM interface. `addresses.wrapperVehicleFactory` is optional on
`ChainAddresses` and absent from production deployments.
