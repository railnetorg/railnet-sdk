---
name: railnet-vehicle
description: >
  Deploy and manage Railnet vehicles and multi-vehicle strategies —
  buildSpawnAaveV3VehicleCall, buildSpawnMultiVehicleCall, buildAuthorizeVehicleCall, buildSetQueuesCall,
  extractMultiVehicleContracts,
  extractAaveV3VehicleAddress, VehicleEntry, QueueEntry, QueueTarget,
  MultiVehicleContracts. Covers STEAM vehicle lifecycle (sync vs async),
  vehicle types (Aave V3, Compound V3, Morpho Blue, ERC4626, Ethena,
  Syrup), and multi-vehicle orchestration. Load when deploying yield
  strategies, spawning vehicles, authorizing sub-vehicles, or
  configuring allocation queues.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.1'
sources:
  - 'railnetorg/railnet-sdk:src/actions/vehicle/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/multiVehicle/*.ts'
  - 'railnetorg/railnet-sdk:src/utils/receipt.ts'
---

## Setup

```typescript
import { createPublicClient, createWalletClient, http, type Hex } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { getAddresses } from '@railnetorg/railnet-sdk'

const publicClient = createPublicClient({ chain: mainnet, transport: http() })
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const walletClient = createWalletClient({ account, chain: mainnet, transport: http() })

const addresses = getAddresses(mainnet.id)
```

## Vehicle Types

Vehicles wrap yield sources with the STEAM interface. Two flavors:

- **Sync**: Deposits and redeems settle in a single transaction (Aave V3, Compound V3, Morpho Blue, ERC4626). State: EMPTY → UNLOCKING → SETTLED.
- **Async**: Redeems require multiple transactions due to cooldowns (Ethena, Syrup). State: EMPTY → PROCESSING → UNLOCKING → SETTLED.

Multi-Vehicles are also vehicles — they implement STEAM and aggregate multiple sub-vehicles into a single entry point.

Note: Factory addresses exist for ERC4626, Morpho Blue, and Wrapper vehicles (`addresses.erc4626VehicleFactory`, etc.), but only `spawnAaveV3Vehicle` is currently exported as a spawn action.

## Core Patterns

### Spawn an Aave V3 Vehicle

```typescript
import { extractAaveV3VehicleAddress, getAddresses, buildSpawnAaveV3VehicleCall, randomSalt } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(mainnet.id)

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnAaveV3VehicleCall({
      factory: addresses.aaveV3VehicleFactory,
      asset: addresses.usdc,
      poolAddressesProvider: addresses.aavePoolAddressesProvider,
      accessControl: eacAddress,
      queryRegistry: queryRegistryAddress,
      initialExpectedSupply: 10n ** 18n,
      account: account.address,
      querySalt: randomSalt(),
      deploymentSalt: randomSalt(), // required: it fixes the deployed address
      // Optional: feeManager, modulesManager, forbiddenAddresses
    }), account: account.address })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const vehicleAddress = extractAaveV3VehicleAddress(receipt, addresses.aaveV3VehicleFactory)
```

### Deploy a Full Multi-Vehicle Ecosystem

There is no `deployMultiVehicle` function; the sequence is yours to send. Send each step with its
builder, simulate first, and keep every hash — a partial deployment is resumable only if you know
where it stopped.

1. Read `AssetRegistry.getInitialDepositAmount(asset)` — the factory rejects a spawn whose asset
   has none registered
2. Approve the MultiVehicle factory for that amount
3. `buildSpawnAccessControlCall` — or reuse an existing ExternalAccessControl.
   `extractAccessControlAddress` reads the address out of the receipt
4. `buildSpawnMultiVehicleCall` — deploys 6 contracts. `extractMultiVehicleContracts` returns them
5. `buildGrantScopedRoleCall` for `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION`, scoped to the
   VehicleManager
6. `buildGrantScopedRoleCall` for `MULTI_VEHICLE_SET_QUEUES`, scoped to the QueueStrategyEngine
7. Per vehicle: for each of `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM`, check whether it is
   public on the vehicle scope; if not, grant it three times — to the MultiVehicle, the
   SectorAccountingEngine and the SubQueryEngine — then `buildAuthorizeVehicleCall`
8. `buildSetQueuesCall` with a deposit and redeem target per vehicle

Getting a scope wrong succeeds silently and every later call reverts with `MissingRole`. Granting
after authorizing fails. The order above is the whole point.

**Vehicles must be deployed before step 4.**

```typescript
import { randomSalt, type VehicleEntry } from '@railnetorg/railnet-sdk'

const vehicles: VehicleEntry[] = [
  {
    address: aaveV3VehicleAddress,
    depositTarget: { value: 5_000n * 10n ** 18n, threshold: 0n },
    redeemTarget: { value: 1_000n * 10n ** 18n, threshold: 0n },
  },
]

// the parameters each step needs, gathered once
const deployment = {
  asset: addresses.usdc,
  name: 'My Strategy',
  symbol: 'MSTRAT',
  vehicles,
  account: account.address,
  salts: {
    multiVehicle: {
      multiVehicle: randomSalt(),
      queryRedeemQueue: randomSalt(),
      queueStrategyEngine: randomSalt(),
      sectorAccountingEngine: randomSalt(),
      subQueryEngine: randomSalt(),
      vehicleManager: randomSalt(),
      initialDepositQuery: randomSalt(),
    },
    accessControl: randomSalt(),
  }, // required — eight contracts. Log them.
  // Optional: queryRegistry (defaults to the chain's addresses.queryRegistry)
  // Optional: accessControl (use existing EAC instead of spawning)
  // Optional: adminAddress (defaults to account)
  // Optional: forbiddenAddresses
  // Optional: feeManager, modulesManager
})

// result.eacAddress — the ExternalAccessControl address
// result.multiVehicleContracts — { multiVehicle, queryRedeemQueue,
//   queueStrategyEngine, sectorAccountingEngine, subQueryEngine, vehicleManager }
// result.transactionHashes — all tx hashes in order
```

### Spawn Multi-Vehicle Manually

Use individual actions when you need custom role configuration.

```typescript
import { extractMultiVehicleContracts, getAddresses, buildSpawnMultiVehicleCall } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(mainnet.id)

// Step 1: Approve factory for initial deposit
// (must be done before spawnMultiVehicle)

// Step 2: Spawn
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnMultiVehicleCall({
      factory: addresses.multiVehicleFactory,
      asset: addresses.usdc,
      name: 'My Strategy',
      symbol: 'MSTRAT',
      accessControl: eacAddress,
      queryRegistry: queryRegistryAddress,
      account: account.address,
      salts: {
      multiVehicle: randomSalt(),
      queryRedeemQueue: randomSalt(),
      queueStrategyEngine: randomSalt(),
      sectorAccountingEngine: randomSalt(),
      subQueryEngine: randomSalt(),
      vehicleManager: randomSalt(),
      initialDepositQuery: randomSalt(),
      }, // required — seven addresses. Log them.
      // Optional: feeManager, modulesManager, forbiddenAddresses, initialInterceptions
    }), account: account.address })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const contracts = extractMultiVehicleContracts(receipt, addresses.multiVehicleFactory)
// contracts.multiVehicle
// contracts.queueStrategyEngine
// contracts.sectorAccountingEngine
// contracts.subQueryEngine
// contracts.vehicleManager
// contracts.queryRedeemQueue
```

### Authorize a Vehicle in a Multi-Vehicle

```typescript
import { buildAuthorizeVehicleCall } from '@railnetorg/railnet-sdk'

writeContract(
  client,
  (await simulateContract(client, { ...buildAuthorizeVehicleCall({
      vehicleManager: contracts.vehicleManager,
      vehicle: aaveV3VehicleAddress,
      account: account.address,
    }), account: account.address })).request,
)
```

### Configure Deposit and Redeem Queues

```typescript
import { buildSetQueuesCall, type QueueEntry } from '@railnetorg/railnet-sdk'

const depositQueue: QueueEntry[] = [
  {
    vehicle: aaveV3VehicleAddress,
    target: { value: 5_000n * 10n ** 18n, threshold: 0n },
  },
]

const redeemQueue: QueueEntry[] = [
  {
    vehicle: aaveV3VehicleAddress,
    target: { value: 1_000n * 10n ** 18n, threshold: 0n },
  },
]

writeContract(
  client,
  (await simulateContract(client, { ...buildSetQueuesCall({
      queueStrategyEngine: contracts.queueStrategyEngine,
      depositQueue,
      redeemQueue,
      account: account.address,
    }), account: account.address })).request,
)
```

### Call Builders

`buildSpawnAaveV3VehicleCall` returns the viem contract call without sending it — synchronous, no
client, and the same parameters as `spawnAaveV3Vehicle`.

```typescript
import { buildSpawnAaveV3VehicleCall } from '@railnetorg/railnet-sdk'

const prepared = buildSpawnAaveV3VehicleCall({
  factory: aaveV3VehicleFactory,
  asset: usdcAddress,
  poolAddressesProvider,
  accessControl: eacAddress,
  deploymentSalt: randomSalt(),
})

const hash = await walletClient.writeContract({ ...prepared, account, chain: mainnet })
```

The vehicle address still has to come from the receipt via `extractAaveV3VehicleAddress`.

## Common Mistakes

### CRITICAL Spawning MV without approving factory first

Wrong:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnMultiVehicleCall({
      factory: addresses.multiVehicleFactory,
      asset: addresses.usdc,
      accessControl: eacAddress,
      queryRegistry: queryRegistryAddress,
      name: 'Strategy',
      symbol: 'STRAT',
      account: account.address,
      salts,
    }), account: account.address })).request,
)
// Reverts: InsufficientAllowance
```

Correct:

```typescript
// The amount comes from the AssetRegistry, not from the caller
const initialDepositAmount = await getInitialDepositAmount(walletClient, {
  assetRegistry: addresses.assetRegistry,
  asset: addresses.usdc,
})

const { request } = await walletClient.simulateContract({
  address: addresses.usdc,
  abi: erc20Abi,
  functionName: 'approve',
  args: [addresses.multiVehicleFactory, initialDepositAmount],
  account: account.address,
})
await walletClient.writeContract(request)
// Then spawn
```

The factory pulls an initial deposit during spawn to protect against share inflation attacks, sized by `AssetRegistry.getInitialDepositAmount(asset)` — not by a spawn parameter. Approving an arbitrary amount reverts with `InsufficientAllowance` when it falls short, and the caller must also hold that balance. The same applies to `spawnConduit` and `spawnAaveV3Vehicle`. Read the registry first and approve exactly that amount.

Source: src/actions/assetRegistry/getInitialDepositAmount.ts

### HIGH The multi-vehicle spawn does not spawn vehicles

Wrong:

```typescript
buildSpawnMultiVehicleCall({
  asset: addresses.usdc,
  name: 'Strategy',
  symbol: 'STRAT',
  vehicles: [{ factory: addresses.aaveV3VehicleFactory, asset: addresses.usdc }],
  account: account.address,
})
```

Correct:

```typescript
// 1. Spawn vehicles first
const vehicleHash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnAaveV3VehicleCall({ ... }), account: account.address })).request,
)
const vehicleReceipt = await publicClient.waitForTransactionReceipt({ hash: vehicleHash })
const vehicleAddress = extractAaveV3VehicleAddress(vehicleReceipt, addresses.aaveV3VehicleFactory)

// 2. Then spawn the MultiVehicle with pre-deployed addresses
buildSpawnMultiVehicleCall({
  asset: addresses.usdc,
  name: 'Strategy',
  symbol: 'STRAT',
  vehicles: [{
    address: vehicleAddress!,
    depositTarget: { value: 5_000n * 10n ** 18n, threshold: 0n },
    redeemTarget: { value: 1_000n * 10n ** 18n, threshold: 0n },
  }],
  account: account.address,
})
```

The `vehicles` parameter takes `VehicleEntry[]` with pre-deployed addresses, not factory configs.

Source: src/actions/multiVehicle/spawnMultiVehicle.ts

### HIGH Deposit queue targets are absolute ceilings, not percentage ratios

Wrong assumption: `target.value: 5000e18` means "maintain 50% allocation".

Correct understanding: `target.value: 5000e18` means "fill up to 5000 shares". Once a vehicle hits its target from yield growth, new deposits skip it and flow to the next entry. Targets are absolute ceilings (deposit queue) or floors (redeem queue), not ongoing ratios.

Source: Protocol docs — manage-multi-vehicle queue semantics

### HIGH Not extracting addresses from transaction receipts

Wrong:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnMultiVehicleCall(params), account: account.address })).request,
)
// hash is just a tx hash — where are the deployed contracts?
```

Correct:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnMultiVehicleCall(params), account: account.address })).request,
)
const receipt = await publicClient.waitForTransactionReceipt({ hash })
const contracts = extractMultiVehicleContracts(receipt, addresses.multiVehicleFactory)
// contracts.multiVehicle, .vehicleManager, .queueStrategyEngine, etc.
```

All spawn actions return only a `Hash`. Use `extractMultiVehicleContracts`, `extractAaveV3VehicleAddress`, or `extractAccessControlAddress` on the receipt to get deployed addresses.

Source: src/utils/receipt.ts

If your security model requires role assignments other than the ones in "Deploy a Full
Multi-Vehicle Ecosystem" above, skip the workflow and use individual `grantScopedRole` calls with
correct scopes.

See also: railnet-core/SKILL.md § Common Mistakes — reads/simulations on the wallet client

See also: railnet-access-control/SKILL.md

See also: railnet-access-control/references/role-reference.md — full role-to-scope mapping
