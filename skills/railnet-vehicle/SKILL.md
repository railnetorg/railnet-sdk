---
name: railnet-vehicle
description: >
  Deploy and operate Railnet vehicles and multi-vehicle strategies —
  buildSpawnAaveV3VehicleCall, buildSpawnErc4626VehicleCall,
  buildSpawnMorphoBlueVehicleCall, buildSpawnWrapperVehicleCall,
  buildSpawnMultiVehicleCall, buildAuthorizeVehicleCall,
  buildUnauthorizeVehicleCall, buildConfigureVehicleCall, buildSetQueuesCall,
  buildSetThresholdsCall, buildSetMaxTotalAssetsCall,
  buildMoveBetweenSectorsCall, buildDispatchVehicleCall,
  simulateDispatchVehicle, buildRebalanceRedeemCall, buildWithdrawToIdleCall,
  buildAllocateIdleCall, getVehicleConversion, getVehicleInterceptions,
  buildProgressQueryCall,
  buildFeedQueryRedeemQueueCall, getSectorBalance, getVehicleManagerLimits,
  estimateVehicle, applySlippage, extractMultiVehicleContracts, sectors and
  VehicleMode. Covers the STEAM vehicle lifecycle (sync vs async),
  multi-vehicle orchestration, allocation queues, sector accounting and
  rebalancing. Load when deploying yield strategies, authorizing sub-vehicles,
  configuring queues, or moving positions between vehicles.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.8.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/vehicle/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/multiVehicle/*.ts'
  - 'railnetorg/railnet-sdk:src/constants/sectors.ts'
  - 'railnetorg/railnet-sdk:src/utils/receipt.ts'
---

# Railnet Vehicle Operations

## Setup

```typescript
import { getAddresses } from '@railnetorg/railnet-sdk'
import { mainnet } from 'viem/chains'
import { simulateContract, writeContract } from 'viem/actions'

const addresses = getAddresses(mainnet.id)
// publicClient simulates and reads. walletClient signs.
```

## Vehicle Types

A vehicle wraps a yield source behind the STEAM interface. Two flavours, and the difference decides
how many transactions an operation takes:

- **Sync** — deposits and redeems settle in one transaction. State goes EMPTY, UNLOCKING, SETTLED.
- **Async** — a cooldown splits the operation. State goes EMPTY, PROCESSING, UNLOCKING, SETTLED, and
  the query must be progressed once the source settles.

A multi-vehicle is itself a vehicle: it implements STEAM and aggregates sub-vehicles behind one
entry point.

## Core Patterns

### Spawning a vehicle

Four factories, one shared parameter shape. Each takes `accessControl`, `queryRegistry`,
`querySalt`, `deploymentSalt`, optional `feeManager`, `modulesManager` and `forbiddenAddresses`, and
all but the wrapper take `initialExpectedSupply`, a floor on the shares the seed deposit must mint
that the factory rejects at zero.

What differs is how the asset is decided.

| Builder | Asset comes from | Extra parameters |
| --- | --- | --- |
| `buildSpawnAaveV3VehicleCall` | `asset` | `poolAddressesProvider` |
| `buildSpawnErc4626VehicleCall` | the vault's own asset | `vault` |
| `buildSpawnMorphoBlueVehicleCall` | the market | `morpho`, `marketId` |
| `buildSpawnWrapperVehicleCall` | `asset` | none, and no `initialExpectedSupply` |

```typescript
import {
  buildSpawnAaveV3VehicleCall, extractAaveV3VehicleAddress,
  getInitialDepositAmount, getMorphoBlueSingleton, randomSalt,
} from '@railnetorg/railnet-sdk'
import { erc20Abi } from 'viem'

// Every factory pulls a seed deposit sized by the AssetRegistry. Approve exactly that.
const initialDepositAmount = await getInitialDepositAmount(publicClient, {
  assetRegistry: addresses.assetRegistry,
  asset: addresses.usdc,
})
await writeContract(walletClient, {
  address: addresses.usdc, abi: erc20Abi, functionName: 'approve',
  args: [addresses.aaveV3VehicleFactory, initialDepositAmount], account: account.address,
})

const hash = await writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildSpawnAaveV3VehicleCall({
      factory: addresses.aaveV3VehicleFactory,
      asset: addresses.usdc,
      poolAddressesProvider: addresses.aavePoolAddressesProvider,
      accessControl,
      queryRegistry: addresses.queryRegistry,
      initialExpectedSupply: 1_000_000n,
      querySalt: randomSalt(),
      deploymentSalt: randomSalt(),
    }),
    account: account.address,
  })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const vehicle = extractAaveV3VehicleAddress(receipt, addresses.aaveV3VehicleFactory)
```

A spawn returns a hash and nothing else. Read the address back from the receipt with
`extractAaveV3VehicleAddress`, `extractErc4626VehicleAddress`, `extractMorphoBlueVehicleAddress` or
`extractWrapperVehicleAddress`.

`morpho` must equal the factory implementation's own `MORPHO`. Read it with
`getMorphoBlueSingleton(client, { factory })` rather than supplying it by hand, and
`getMorphoMarketAsset(client, { morpho, marketId })` gives the asset a market resolves to.

`addresses.wrapperVehicleFactory` is optional on `ChainAddresses`. Production deployments ship no
wrapper vehicle, so it is `undefined` outside `@railnetorg/railnet-sdk/staging`. Guard before use.

### Deploying a multi-vehicle

There is no `deployMultiVehicle` helper. The sequence is yours to send, it is eight or more
transactions, and the order is load-bearing: every role grant must land before the call that checks
it, and a wrong scope succeeds silently then reverts later with `MissingRole`.

Vehicles must already be deployed. `buildSpawnMultiVehicleCall` spawns the ecosystem, not the
sub-vehicles, and takes no `vehicles` parameter.

1. Read `getInitialDepositAmount` for the asset, then approve the MultiVehicle factory for it
2. `buildSpawnAccessControlCall`, or reuse an ExternalAccessControl.
   `extractAccessControlAddress` reads it back
3. `buildSpawnMultiVehicleCall` — deploys six contracts.
   `extractMultiVehicleContracts` returns them all
4. Grant `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION`, scoped to the VehicleManager
5. Grant `MULTI_VEHICLE_SET_QUEUES`, scoped to the QueueStrategyEngine
6. Per vehicle, for each of `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM`: check whether it is
   public on that vehicle's scope, and if not grant it to the MultiVehicle, the
   SectorAccountingEngine and the SubQueryEngine. Then `buildAuthorizeVehicleCall`
7. `buildSetQueuesCall` with a deposit and redeem entry per vehicle

```typescript
import { buildSpawnMultiVehicleCall, extractMultiVehicleContracts, randomSalt } from '@railnetorg/railnet-sdk'

const hash = await writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildSpawnMultiVehicleCall({
      factory: addresses.multiVehicleFactory,
      asset: addresses.usdc,
      name: 'My Strategy',
      symbol: 'MSTRAT',
      accessControl,
      queryRegistry: addresses.queryRegistry,
      salts: {
        multiVehicle: randomSalt(),
        queryRedeemQueue: randomSalt(),
        queueStrategyEngine: randomSalt(),
        sectorAccountingEngine: randomSalt(),
        subQueryEngine: randomSalt(),
        vehicleManager: randomSalt(),
        initialDepositQuery: randomSalt(),
      },
      // feeManager, modulesManager, forbiddenAddresses, initialInterceptions optional
    }),
    account: account.address,
  })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const contracts = extractMultiVehicleContracts(receipt, addresses.multiVehicleFactory)
// multiVehicle, queryRedeemQueue, queueStrategyEngine, sectorAccountingEngine,
// subQueryEngine, vehicleManager
```

Seven salts go in, six contracts come out: `initialDepositQuery` salts the seed deposit's query
rather than a deployment. Log all seven, because they fix the addresses.

Source: src/actions/multiVehicle/spawnMultiVehicle.ts, docs/pages/workflows/deployingAMultiVehicle.mdx

### Authorizing and configuring a sub-vehicle

```typescript
import { buildAuthorizeVehicleCall, buildConfigureVehicleCall, VehicleMode } from '@railnetorg/railnet-sdk'

const authorize = buildAuthorizeVehicleCall({ vehicleManager, vehicle })

const configure = buildConfigureVehicleCall({
  vehicleManager,
  vehicle,
  config: {
    mode: VehicleMode.Automatic, // Manual keeps the queue strategy out, leaving operator dispatches
    cap: { value: 5_000n * 10n ** 18n, threshold: 0n },
  },
})
```

`configure` assigns the struct outright. It replaces the whole configuration, so a caller that does
not start from the current config silently resets whatever it did not set. The cap is in the
SUB-VEHICLE's share units at 18 decimals, not the multi vehicle's asset. `2n ** 256n - 1n` means
unlimited, and `threshold` is then ignored but stored as passed, so send 0.

`buildUnauthorizeVehicleCall` drops the authorization and the configuration. It does not unwind
holdings: the position stays put until an operator moves it.

### Allocation queues

```typescript
import { buildSetQueuesCall } from '@railnetorg/railnet-sdk'

const call = buildSetQueuesCall({
  queueStrategyEngine,
  depositQueue: [{ vehicle, target: { value: 5_000n * 10n ** 18n, threshold: 0n } }],
  redeemQueue: [{ vehicle, target: { value: 1_000n * 10n ** 18n, threshold: 0n } }],
})
```

A target is an absolute amount in the sub-vehicle's share units, not a ratio. On the deposit queue
it is a ceiling: once a vehicle reaches it, whether by deposits or by yield, new deposits skip to
the next entry. On the redeem queue it is a floor.

Entries are validated on chain and rejected with `InvalidQueueEntry(index, vehicle, reason)`. Both
queues need a ready vehicle whose asset matches the engine's, in a mode other than `Manual`. A
deposit entry also needs it authorized with a non-zero `value`; a redeem entry needs a single-asset
vehicle and a finite target. Unlimited is accepted on the deposit queue only.

### Sectors, dispatch and rebalance

A multi vehicle's assets live in accounting sectors on the SectorAccountingEngine. Moving between
sectors is bookkeeping; dispatching is what actually touches a sub-vehicle.

```typescript
import {
  SECTOR_ALLOCATION, SECTOR_AVAILABLE, buildDispatchVehicleCall, buildRebalanceRedeemCall,
  getSectorBalance, simulateDispatchVehicle, vehicleSector, QueryMode,
} from '@railnetorg/railnet-sdk'

// A vehicle's own sector is read with the vehicle as the asset, because it holds that vehicle's shares.
const staged = await getSectorBalance(publicClient, {
  sectorAccountingEngine, sector: vehicleSector(vehicle), asset: vehicle,
})

// Simulate first: the returned query is what you need to progress an async dispatch later.
const { query, state } = await simulateDispatchVehicle(publicClient, {
  sectorAccountingEngine, vehicle, mode: QueryMode.DEPOSIT,
  amount: 1_000_000n,
  settledDestination: vehicleSector(vehicle),
  rejectedDestination: SECTOR_ALLOCATION,
  operationId: randomSalt(),
  account: account.address,
})

// Moving a position between two sub-vehicles is one multicall, not two transactions.
const rebalance = buildRebalanceRedeemCall({
  sectorAccountingEngine, from: sourceVehicle, to: destinationVehicle,
  shares: 500n * 10n ** 18n, operationId: randomSalt(),
})
```

Static sectors are `SECTOR_ENTRY`, `SECTOR_AVAILABLE`, `SECTOR_ALLOCATION`, `SECTOR_RESERVED` and
`SECTOR_EXIT`. `vehicleSector(vehicle)` builds a vehicle's own, `isVehicleSector` and
`sectorToVehicle` decode one read back from an event.

`buildRebalanceRedeemCall` batches a move and a redeem dispatch because the two are not independent:
sent separately and abandoned in between, the shares sit in the source's staging sector, out of
ALLOCATION and earning nothing. The proceeds settle into the destination's sector rather than
AVAILABLE, where the queue strategy could re-allocate them mid-rebalance. Depositing them into the
destination is a second transaction, because an async source only settles once its query progresses.

`buildWithdrawToIdleCall` and `buildAllocateIdleCall` are the same move-plus-dispatch shape aimed
at AVAILABLE. Withdrawing settles a redeem into AVAILABLE rather than staging it for a second
vehicle, and needs no authorization on the source. Allocating deposits from AVAILABLE into one
chosen sub-vehicle, pinned to the amount: a cap on it reverts `DepositLimitedByCap`, and its own
`maxDeposit` reverts `DispatchDepositAmountTooHigh`, rather than depositing less.

Source: src/actions/multiVehicle/rebalance.ts, docs/pages/workflows/rebalancingBetweenVehicles.mdx

### Progressing an async dispatch

`simulateDispatchVehicle` bubbles the vehicle's state up unchanged. `SETTLED` and `REJECTED` are
terminal; anything else means the vehicle is async and the query still needs progressing.

```typescript
import { QueryState, buildProgressQueryCall, simulateDispatchVehicle } from '@railnetorg/railnet-sdk'

const { query, state } = await simulateDispatchVehicle(publicClient, dispatchParameters)

if (state !== QueryState.SETTLED && state !== QueryState.REJECTED) {
  // Keep query, and both destinations exactly as dispatched: they are part of the sub-query's id.
  const call = buildProgressQueryCall({
    subQueryEngine, chainId: mainnet.id, vehicle, query,
    settledDestination: dispatchParameters.settledDestination,
    rejectedDestination: dispatchParameters.rejectedDestination,
  })
}
```

Reverts `UnknownSubQuery` when any field differs from the dispatch, and `SubQueryAlreadyFinalized`
once the sub-query is terminal. `toSubQuery(parameters)` builds the identifying struct on its own.

### Reads and estimates

```typescript
import { applySlippage, estimateVehicle, getVehicleManagerLimits } from '@railnetorg/railnet-sdk'

const limits = await getVehicleManagerLimits(publicClient, { vehicleManager })
// minSharesForAutoFulfill, extraAssetsForWithdrawalRequests, maxTotalAssets

const estimate = await estimateVehicle(publicClient, { vehicle, asset, mode, estimationType })
const floor = applySlippage(estimate.value, 50) // 50 bps
```

`estimateVehicle` with `applySlippage` is the correct source for a deposit's `minOutput`, because
that floor is compared in vehicle shares. Never derive it from `estimateConduit`.

## Common Mistakes

### CRITICAL Spawning without approving the factory first

Every factory pulls a seed deposit during spawn, sized by `AssetRegistry.getInitialDepositAmount(asset)`
and not by a spawn parameter. It guards against share inflation. Approving an arbitrary amount
reverts `InsufficientAllowance` when it falls short, and the caller must hold that balance too.

This applies to the four vehicle factories, the MultiVehicle factory and the ConduitFactory alike.
Read the registry and approve exactly what it returns.

Source: src/actions/assetRegistry/getInitialDepositAmount.ts

### CRITICAL Reads and simulations do not belong on the wallet client

Every write is a `build*Call` builder returning `{ address, abi, functionName, args }`. Simulate on
the public client, then send the request with the wallet.

```typescript
const { request } = await simulateContract(publicClient, { ...buildSetQueuesCall({ /* … */ }), account })
const hash = await writeContract(walletClient, request)
```

A wallet answers reads from whatever node it picked, at whatever freshness it keeps, so a preflight
sent there can reject a valid call. In React the hooks do this for you and simulate on
`usePublicClient`.

### CRITICAL The multi-vehicle spawn does not spawn vehicles

`buildSpawnMultiVehicleCall` has no `vehicles` parameter. It deploys the six ecosystem contracts and
nothing else. Spawn each sub-vehicle first with its own factory, read the address out of the
receipt, then authorize and queue it after the multi vehicle exists.

Source: src/actions/multiVehicle/spawnMultiVehicle.ts

### HIGH Sending the multi-vehicle steps out of order

Every role grant must land before the call that checks it, and granting after authorizing fails.
Most roles are scoped to a specific deployed contract, not to the MultiVehicle:
`MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` to the VehicleManager, `MULTI_VEHICLE_SET_QUEUES` to the
QueueStrategyEngine, `MULTI_VEHICLE_PROGRESS_QUERY` to the SubQueryEngine, `MULTI_VEHICLE_MOVE` and
`MULTI_VEHICLE_DISPATCH` to the SectorAccountingEngine.

A wrong scope succeeds silently. The revert arrives later, as `MissingRole` on an unrelated call.

Source: docs/pages/workflows/deployingAMultiVehicle.mdx

### HIGH Queue and cap targets are absolute, not ratios

`target.value: 5000e18` means "fill up to 5000 shares", never "hold 50%". Once a vehicle reaches its
target, from deposits or from yield, new deposits skip it and flow to the next entry. The same holds
for a `VehicleCap`.

Both are denominated in the SUB-VEHICLE's share units at 18 decimals. Reading them as the multi
vehicle's asset is how a cap ends up orders of magnitude wrong.

### HIGH Partial updates that silently reset the rest

Three setters replace a whole struct rather than merging:

- `buildConfigureVehicleCall` assigns mode and cap together
- `buildSetThresholdsCall` assigns both thresholds together, so passing 0 for a field meant to be
  left alone enables auto-fulfill on every request
- `buildSetQueuesCall` replaces both queues

`minSharesForAutoFulfill` starts at `2n ** 256n - 1n` on a fresh deployment, which disables
auto-fulfill. Read the current value with `getVehicleManagerLimits` before writing either threshold.

Source: src/actions/multiVehicle/setThresholds.ts

### HIGH Combining minOutput with a maxUint256 amount

`buildDispatchVehicleCall` throws before encoding when `amount` is `maxUint256` and `minOutput` is
non-zero, because the engine rejects that pair with `MinOutputRequiresPinnedAmount`. The sentinel
resolves to the whole sector balance, and a floor can only bind against a pinned amount. Pass an
explicit amount, or set `minOutput` to `0n` when dispatching everything.

Source: src/actions/multiVehicle/dispatchVehicle.ts

### HIGH Not reading addresses back from the receipt

Every spawn returns only a `Hash`. Use `extractMultiVehicleContracts`, the per-vehicle extractors or
`extractAccessControlAddress` on the receipt. Each returns `null` when the event is absent, so a
deployment script that skips the check carries `null` into the next step.

Source: src/utils/receipt.ts

## References

- [Multi-Vehicle Reference](references/multiVehicle.md) — parameters, roles and reverts per action

See also: railnet-access-control/SKILL.md, and its references/role-reference.md for the full
role-to-scope mapping.

See also: railnet-conduit/SKILL.md — a conduit fronts a vehicle, and
`buildSetVehicleInterceptionsCall` is the vehicle-side counterpart of the conduit interception call.

`getVehicleInterceptions` reads the stored list. `buildSetVehicleInterceptionsCall` replaces it
wholesale, so an edit starts from that read.
