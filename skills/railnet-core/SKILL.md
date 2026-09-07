---
name: railnet-core
description: >
  Set up railnet-sdk with viem clients, use the railnetActions decorator,
  understand chain support (Base 8453 only), contract addresses via
  getAddresses, ABIs (conduitAbi, conduitFactoryAbi,
  multiVehicleFactoryAbi, aaveV3VehicleFactoryAbi,
  accessControlFactoryAbi, externalAccessControlAbi,
  queueStrategyEngineAbi, sectorAccountingEngineAbi,
  vehicleManagerAbi), enums (ConduitMode, ConduitState,
  EstimationType), types (Asset, ConduitInfo,
  ChainAddresses), and role constants. Load when installing railnet-sdk,
  creating a client, or importing SDK utilities.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.1'
sources:
  - 'railnetorg/railnet-sdk:src/index.ts'
  - 'railnetorg/railnet-sdk:src/decorator.ts'
  - 'railnetorg/railnet-sdk:src/contracts/chains.ts'
  - 'railnetorg/railnet-sdk:src/contracts/addresses.ts'
---

## Setup

Install the SDK and its required peer dependency:

```bash
npm install @railnetorg/railnet-sdk viem
```

## Core Patterns

### Client Setup with railnetActions
The SDK extends viem clients with specialized read actions for Railnet contracts.

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { railnetActions } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: base,
  transport: http(),
}).extend(railnetActions)

// Usage — read-only actions via decorator
const info = await client.getConduitInfo({
  conduit: '0x1234567890123456789012345678901234567890'
})
```

The decorator exposes four read actions: `getConduitPosition`, `getConduitInfo`, `predictConduitDeployment`, and `estimateConduit`. Write actions (deposit, redeem, spawn, etc.) are standalone functions — see railnet-conduit and railnet-vehicle skills.

### Contract Address Lookup
Retrieve factory and registry addresses for the supported chains (Ethereum and Base).

```typescript
import { getAddresses } from '@railnetorg/railnet-sdk'
import { base } from 'viem/chains'

const addresses = getAddresses(base.id)
// addresses.conduitFactory
// addresses.coreFactory
// addresses.multiVehicleFactory
// addresses.aaveV3VehicleFactory
// addresses.erc4626VehicleFactory
// addresses.morphoBlueVehicleFactory
// addresses.wrapperVehicleFactory
// addresses.eacFactory              — ExternalAccessControl factory
// addresses.adminEac                — Admin ExternalAccessControl
// addresses.feeManagerFactory
// addresses.modulesManagerFactory
// addresses.accountListFactory
// addresses.ownerRegistryFactory
// addresses.assetRegistry           — per-asset initial deposit amounts
// addresses.queryRegistry           — required to spawn a multi-vehicle or a vehicle
// addresses.aavePoolAddressesProvider
// addresses.usdc                    — USDC on Base
```

### Direct ABI Usage
Use exported ABIs for custom viem calls or event listening.

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { conduitAbi } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: base,
  transport: http(),
})

const balance = await client.readContract({
  address: '0x1234567890123456789012345678901234567890',
  abi: conduitAbi,
  functionName: 'balanceOf',
  args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
})
```

Nine ABIs are exported: `conduitAbi`, `conduitFactoryAbi`, `multiVehicleFactoryAbi`, `aaveV3VehicleFactoryAbi`, `accessControlFactoryAbi`, `externalAccessControlAbi`, `queueStrategyEngineAbi`, `sectorAccountingEngineAbi`, `vehicleManagerAbi`.

### Writing

Every write is a `prepare*` builder: synchronous, takes no client, sends nothing, returns
`PreparedWrite` (`{ address, abi, functionName, args }`). Simulate it on a client whose transport
you chose, then send the request with the wallet.

```typescript
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { readContract, simulateContract, writeContract } from 'viem/actions'
import { conduitAbi, prepareDepositConduit, randomSalt } from '@railnetorg/railnet-sdk'

const account = privateKeyToAccount('0x...')
const client = createWalletClient({ account, chain: base, transport: http() })

const conduit = '0x1234567890123456789012345678901234567890' as const

// approve the conduit for the token first — the SDK does not do it for you
const vehicle = await readContract(client, {
  address: conduit,
  abi: conduitAbi,
  functionName: 'getVehicle',
})

const { request } = await simulateContract(client, {
  ...prepareDepositConduit({
    conduit,
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    amount: 1_000_000n,
    account: account.address,
    vehicle,
    salt: randomSalt(),
  }),
  account: account.address,
})

const hash = await writeContract(client, request)
```

In React the hooks do this, and they simulate on `usePublicClient` rather than on the wallet: a
wallet answers reads from whatever node it picked, at whatever freshness it keeps.

Three things the builders do NOT do:

- **No approval.** A deposit needs the conduit approved for the token, and the allowance is spent
  by the deposit. It is a plain ERC-20 call.
- **No chain reads.** `prepareDepositConduit` requires `vehicle` (from `conduit.getVehicle()`) and
  `prepareRedeemConduit` requires `outputAsset` (from `conduit.asset()`).
- **No salt generation.** Every salt is a required parameter, so the same inputs always encode the
  same calldata. Use `randomSalt()`, and keep the deployment ones — they fix the deployed address,
  and `prepareSpawnMultiVehicle` takes seven at once.

`ContractCallOptions` (gas, nonce, fee overrides, `stateOverride`, `dataSuffix`) is accepted by
`simulateDispatchVehicle`. The builders take one parameter and nothing else.

## Common Mistakes

### CRITICAL Using mainnet instead of Base

Wrong:

```typescript
import { mainnet } from 'viem/chains'
import { getAddresses } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(mainnet.id)
```

Correct:

```typescript
import { base } from 'viem/chains'
import { getAddresses } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)
```

`getAddresses` throws on any chain other than Ethereum (1) and Base (8453). Use `isSupportedChain(chainId)` to check before calling.

Source: src/contracts/chains.ts

### HIGH Importing React hooks from wrong entry point

Wrong:

```typescript
import { useConduitPosition } from '@railnetorg/railnet-sdk'
```

Correct:

```typescript
import { useConduitPosition } from '@railnetorg/railnet-sdk/react'
```

React hooks are exported from the `@railnetorg/railnet-sdk/react` subpath. The main entry point only exports core actions, ABIs, and utilities.

Source: package.json exports field

### CRITICAL Missing viem peer dependency

Wrong:

```bash
npm install @railnetorg/railnet-sdk
```

Correct:

```bash
npm install @railnetorg/railnet-sdk viem
```

`viem` is a required peer dependency. All SDK functions depend on viem types and utilities. Without it, imports fail at runtime.

Source: package.json peerDependencies

### HIGH A deposit is two transactions

Wrong:

```typescript
import { prepareDepositConduit, randomSalt } from '@railnetorg/railnet-sdk'

const hash = writeContract(
  client,
  (await simulateContract(client, { ...prepareDepositConduit({ conduit, token, amount: 1000000n, account: myAddress, vehicle, salt: randomSalt() }), account: myAddress })).request,
)
// Assumes the conduit is already approved
```

Correct:

```typescript
import { prepareDepositConduit, randomSalt } from '@railnetorg/railnet-sdk'

// approve first — the conduit pulls the token, and the allowance is spent by the deposit
await writeContract(client, {
  address: token, abi: erc20Abi, functionName: 'approve', args: [conduit, 1000000n], account: myAddress,
})

const hash = writeContract(
  client,
  (await simulateContract(client, { ...prepareDepositConduit({ conduit, token, amount: 1000000n, account: myAddress, vehicle, salt: randomSalt() }), account: myAddress })).request,
)
// Two transactions. Account for both in gas estimation and UI loading states.
```

A deposit is two transactions: the conduit pulls the token, so it must be approved first, and the allowance is spent by the deposit. The SDK does not approve for you — an approval is a plain ERC-20 call. A redeem is one transaction: the conduit burns the caller's shares internally.

Source: src/actions/conduit/depositConduit.ts

### CRITICAL Reads and simulations do not belong on the wallet client

Wrong:

```typescript
const { request } = await simulateContract(walletClient, {
  ...prepareDepositConduit({ conduit, token, amount: 1000000n, account, vehicle, salt: randomSalt() }),
  account,
})
const hash = await writeContract(walletClient, request)
```

Correct:

```typescript
const { request } = await simulateContract(publicClient, {
  ...prepareDepositConduit({ conduit, token, amount: 1000000n, account, vehicle, salt: randomSalt() }),
  account,
})
const hash = await writeContract(walletClient, request)
```

A wallet answers reads from whatever node it picked, at whatever freshness it keeps, so a preflight
sent there can reject a valid call. Only signing needs the wallet. A script with a single client
uses it for both — it chose that client's transport.

Source: src/react/simulateThenWrite.ts

See also: railnet-conduit/SKILL.md
