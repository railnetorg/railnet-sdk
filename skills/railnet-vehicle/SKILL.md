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
type: core
library: railnet-sdk
library_version: '0.1.0'
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

Note: Factory addresses exist for Compound V3, ERC4626, Morpho Blue, and Wrapper vehicles (`addresses.compoundV3VehicleFactory`, etc.), but only `spawnAaveV3Vehicle` is currently exported as a spawn action.

## Core Patterns

### Spawn an Aave V3 Vehicle

```typescript
import {
  spawnAaveV3Vehicle,
  extractAaveV3VehicleAddress,
  getAddresses,
} from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

const hash = await spawnAaveV3Vehicle(walletClient, {
  factory: addresses.aaveV3VehicleFactory,
  asset: addresses.usdc,
  poolAddressesProvider: addresses.aavePoolAddressesProvider,
  accessControl: eacAddress,
  initialDepositSize: 1_000_000n, // 1 USDC (6 decimals)
  initialExpectedSupply: 10n ** 18n,
  account: account.address,
  // Optional: feeManager, modulesManager, querySalt, deploymentSalt
})

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const vehicleAddress = extractAaveV3VehicleAddress(receipt, addresses.aaveV3VehicleFactory)
```

### Deploy a Full Multi-Vehicle Ecosystem

The `deployMultiVehicle` workflow orchestrates the entire setup in sequence:

1. Spawn ExternalAccessControl (or use existing via `accessControl` param)
2. Approve factory for initial deposit
3. Spawn MultiVehicle (deploys 6 contracts)
4. Grant `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` (scoped to VehicleRegistry)
5. Grant `MULTI_VEHICLE_SET_QUEUES` (scoped to QueueStrategyEngine)
6. Per vehicle: check if `VEHICLE_STEAM` is public on vehicle scope, and if not grant ×3 (to MV, SectorAccountingEngine, SubQueryEngine) + authorize
7. Set deposit/redeem queues

**Vehicles must be deployed before calling this workflow.**

```typescript
import { deployMultiVehicle, type VehicleEntry } from '@railnetorg/railnet-sdk'

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
  initialDepositAmount: 1_000_000n, // 1 USDC
  vehicles,
  account: account.address,
  // Optional: accessControl (use existing EAC instead of spawning)
  // Optional: adminAddress (defaults to account)
  // Optional: initialExpectedSupply (defaults to 10n ** 18n)
  // Optional: feeManager, modulesManager
})

// result.eacAddress — the ExternalAccessControl address
// result.multiVehicleContracts — { multiVehicle, queryRedeemQueue,
//   queueStrategyEngine, sectorAccountingEngine, subQueryEngine, vehicleRegistry }
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
  initialDepositSize: 1_000_000n,
  initialExpectedSupply: 10n ** 18n,
  account: account.address,
  // Optional: feeManager, modulesManager, salts (MultiVehicleSalts),
  //           initialInterceptions
})

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const contracts = extractMultiVehicleContracts(receipt, addresses.multiVehicleFactory)
// contracts.multiVehicle
// contracts.queueStrategyEngine
// contracts.sectorAccountingEngine
// contracts.subQueryEngine
// contracts.vehicleRegistry
// contracts.queryRedeemQueue
```

### Authorize a Vehicle in a Multi-Vehicle

```typescript
import { authorizeVehicle } from '@railnetorg/railnet-sdk'

await authorizeVehicle(walletClient, {
  vehicleRegistry: contracts.vehicleRegistry,
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

## Common Mistakes

### CRITICAL Spawning MV without approving factory first

Wrong:

```typescript
const hash = await spawnMultiVehicle(walletClient, {
  factory: addresses.multiVehicleFactory,
  asset: addresses.usdc,
  initialDepositSize: 1_000_000n,
  initialExpectedSupply: 10n ** 18n,
  accessControl: eacAddress,
  name: 'Strategy',
  symbol: 'STRAT',
  account: account.address,
})
// Reverts: InsufficientAllowance
```

Correct:

```typescript
// Approve factory FIRST
const { request } = await walletClient.simulateContract({
  address: addresses.usdc,
  abi: erc20Abi,
  functionName: 'approve',
  args: [addresses.multiVehicleFactory, 1_000_000n],
  account: account.address,
})
await walletClient.writeContract(request)
// Then spawn — or just use deployMultiVehicle which handles this
```

The factory pulls an initial deposit during spawn to protect against share inflation attacks. Without approval, the transaction reverts. The `deployMultiVehicle` workflow handles this automatically.

Source: src/workflows/deployMultiVehicle.ts:76-86

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
- Missing role grants (e.g., forgetting to grant VEHICLE_STEAM to SubQueryEngine)
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
  initialDepositAmount: 1_000_000n,
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
  initialDepositAmount: 1_000_000n,
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
// contracts.multiVehicle, .vehicleRegistry, .queueStrategyEngine, etc.
```

All spawn actions return only a `Hash`. Use `extractMultiVehicleContracts`, `extractAaveV3VehicleAddress`, or `extractAccessControlAddress` on the receipt to get deployed addresses.

Source: src/utils/receipt.ts

### MEDIUM Confusion between deployMultiVehicle role grants and custom setup

The `deployMultiVehicle` workflow checks if `VEHICLE_STEAM` is already public on each vehicle's scope (via `isScopedRolePublic`). If not, it grants `VEHICLE_STEAM` to three specific addresses per vehicle: `multiVehicle`, `sectorAccountingEngine`, and `subQueryEngine`. It also grants `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` (scoped to VehicleRegistry) and `MULTI_VEHICLE_SET_QUEUES` (scoped to QueueStrategyEngine) to the admin.

If your security model requires different role assignments, skip the workflow and use individual `grantScopedRole` calls with correct scopes.

Source: src/workflows/deployMultiVehicle.ts:147-238

See also: railnet-access-control/SKILL.md

See also: railnet-access-control/references/role-reference.md — full role-to-scope mapping
