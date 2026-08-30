---
name: railnet-vehicle
description: >
  Deploy and manage Railnet vehicles and multi-vehicle strategies —
  spawnAaveV3Vehicle, spawnMultiVehicle, authorizeVehicle, setQueues,
  deployMultiVehicle workflow, extractMultiVehicleContracts,
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
  - 'railnetorg/railnet-sdk:src/workflows/deployMultiVehicle.ts'
  - 'railnetorg/railnet-sdk:src/utils/receipt.ts'
---

## Setup

```typescript
import { createPublicClient, createWalletClient, http, type Hex } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { getAddresses } from '@railnetorg/railnet-sdk'

const publicClient = createPublicClient({ chain: base, transport: http() })
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const walletClient = createWalletClient({ account, chain: base, transport: http() })

const addresses = getAddresses(base.id)
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
import {
  spawnAaveV3Vehicle,
  extractAaveV3VehicleAddress,
  getAddresses,
  randomSalt,
} from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

const hash = await spawnAaveV3Vehicle(walletClient, {
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
})

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const vehicleAddress = extractAaveV3VehicleAddress(receipt, addresses.aaveV3VehicleFactory)
```

### Deploy a Full Multi-Vehicle Ecosystem

The `deployMultiVehicle` workflow orchestrates the entire setup in sequence:

1. Spawn ExternalAccessControl (or use existing via `accessControl` param)
2. Approve factory for initial deposit
3. Spawn MultiVehicle (deploys 6 contracts)
4. Grant `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` (scoped to VehicleManager)
5. Grant `MULTI_VEHICLE_SET_QUEUES` (scoped to QueueStrategyEngine)
6. Per vehicle: for each of `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM`, check if it is public on the vehicle scope, and if not grant it x3 (to MV, SectorAccountingEngine, SubQueryEngine) + authorize
7. Set deposit/redeem queues

**Vehicles must be deployed before calling this workflow.**

```typescript
import { deployMultiVehicle, randomSalt, type VehicleEntry } from '@railnetorg/railnet-sdk'

const vehicles: VehicleEntry[] = [
  {
    address: aaveV3VehicleAddress,
    depositTarget: { value: 5_000n * 10n ** 18n, threshold: 0n },
    redeemTarget: { value: 1_000n * 10n ** 18n, threshold: 0n },
  },
]

const result = await deployMultiVehicle(walletClient, {
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
import {
  spawnMultiVehicle,
  extractMultiVehicleContracts,
  getAddresses,
} from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

// Step 1: Approve factory for initial deposit
// (must be done before spawnMultiVehicle)

// Step 2: Spawn
const hash = await spawnMultiVehicle(walletClient, {
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
})

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
import { authorizeVehicle } from '@railnetorg/railnet-sdk'

await authorizeVehicle(walletClient, {
  vehicleManager: contracts.vehicleManager,
  vehicle: aaveV3VehicleAddress,
  account: account.address,
})
```

### Configure Deposit and Redeem Queues

```typescript
import { setQueues, type QueueEntry } from '@railnetorg/railnet-sdk'

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

await setQueues(walletClient, {
  queueStrategyEngine: contracts.queueStrategyEngine,
  depositQueue,
  redeemQueue,
  account: account.address,
})
```

### Prepared Writes

`prepareSpawnAaveV3Vehicle` returns the viem contract call without sending it — synchronous, no
client, and the same parameters as `spawnAaveV3Vehicle`.

```typescript
import { prepareSpawnAaveV3Vehicle } from '@railnetorg/railnet-sdk'

const prepared = prepareSpawnAaveV3Vehicle({
  factory: aaveV3VehicleFactory,
  asset: usdcAddress,
  poolAddressesProvider,
  accessControl: eacAddress,
  deploymentSalt: randomSalt(),
})

const hash = await walletClient.writeContract({ ...prepared, account, chain: base })
```

The vehicle address still has to come from the receipt via `extractAaveV3VehicleAddress`.

## Common Mistakes

### CRITICAL Spawning MV without approving factory first

Wrong:

```typescript
const hash = await spawnMultiVehicle(walletClient, {
  factory: addresses.multiVehicleFactory,
  asset: addresses.usdc,
  accessControl: eacAddress,
  queryRegistry: queryRegistryAddress,
  name: 'Strategy',
  symbol: 'STRAT',
  account: account.address,
  salts,
})
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
// Then spawn — or just use deployMultiVehicle which handles this
```

The factory pulls an initial deposit during spawn to protect against share inflation attacks, sized by `AssetRegistry.getInitialDepositAmount(asset)` — not by a spawn parameter. Approving an arbitrary amount reverts with `InsufficientAllowance` when it falls short, and the caller must also hold that balance. The same applies to `spawnConduit` and `spawnAaveV3Vehicle`. The `deployMultiVehicle` workflow reads the registry and approves for you.

Source: src/actions/assetRegistry/getInitialDepositAmount.ts

### CRITICAL Write actions take a single client, not two

Wrong:

```typescript
const hash = await spawnMultiVehicle(publicClient, walletClient, { ... })
```

Correct:

```typescript
const hash = await spawnMultiVehicle(walletClient, { ... })
```

All write actions take `(client, parameters, options?)` — a single viem client (typically a wallet client) that handles both simulation and signing internally.

Source: src/actions/multiVehicle/spawnMultiVehicle.ts:45-48

### HIGH Using individual actions when deployMultiVehicle exists

The `deployMultiVehicle` workflow orchestrates 8+ transactions in the correct order with the correct role scoping. Manually orchestrating this risks:
- Missing role grants (e.g., forgetting to grant VEHICLE_STEAM_DEPOSIT and VEHICLE_STEAM_REDEEM to SubQueryEngine)
- Wrong scope addresses (most roles must be scoped to SectorAccountingEngine, not MultiVehicle)
- Wrong ordering (authorize before role grants will fail)

Use individual actions only when you need custom role configuration.

Source: src/workflows/deployMultiVehicle.ts

### HIGH deployMultiVehicle does NOT spawn vehicles

Wrong:

```typescript
const result = await deployMultiVehicle(walletClient, {
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
const vehicleHash = await spawnAaveV3Vehicle(walletClient, { ... })
const vehicleReceipt = await publicClient.waitForTransactionReceipt({ hash: vehicleHash })
const vehicleAddress = extractAaveV3VehicleAddress(vehicleReceipt, addresses.aaveV3VehicleFactory)

// 2. Then deploy MV with pre-deployed addresses
const result = await deployMultiVehicle(walletClient, {
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

Source: src/workflows/deployMultiVehicle.ts:27-31

### HIGH Deposit queue targets are absolute ceilings, not percentage ratios

Wrong assumption: `target.value: 5000e18` means "maintain 50% allocation".

Correct understanding: `target.value: 5000e18` means "fill up to 5000 shares". Once a vehicle hits its target from yield growth, new deposits skip it and flow to the next entry. Targets are absolute ceilings (deposit queue) or floors (redeem queue), not ongoing ratios.

Source: Protocol docs — manage-multi-vehicle queue semantics

### HIGH Not extracting addresses from transaction receipts

Wrong:

```typescript
const hash = await spawnMultiVehicle(walletClient, params)
// hash is just a tx hash — where are the deployed contracts?
```

Correct:

```typescript
const hash = await spawnMultiVehicle(walletClient, params)
const receipt = await publicClient.waitForTransactionReceipt({ hash })
const contracts = extractMultiVehicleContracts(receipt, addresses.multiVehicleFactory)
// contracts.multiVehicle, .vehicleManager, .queueStrategyEngine, etc.
```

All spawn actions return only a `Hash`. Use `extractMultiVehicleContracts`, `extractAaveV3VehicleAddress`, or `extractAccessControlAddress` on the receipt to get deployed addresses.

Source: src/utils/receipt.ts

### MEDIUM Confusion between deployMultiVehicle role grants and custom setup

The `deployMultiVehicle` workflow checks, for `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM` separately, whether the role is already public on each vehicle scope (via `isScopedRolePublic`). If not, it grants that role to three specific addresses per vehicle: `multiVehicle`, `sectorAccountingEngine`, and `subQueryEngine`. It also grants `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` (scoped to VehicleManager) and `MULTI_VEHICLE_SET_QUEUES` (scoped to QueueStrategyEngine) to the admin.

If your security model requires different role assignments, skip the workflow and use individual `grantScopedRole` calls with correct scopes.

Source: src/workflows/deployMultiVehicle.ts:147-238

See also: railnet-access-control/SKILL.md

See also: railnet-access-control/references/role-reference.md — full role-to-scope mapping
