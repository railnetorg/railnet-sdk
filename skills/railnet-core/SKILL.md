---
name: railnet-core
description: >
  Set up railnet-sdk with viem clients, use the railnetActions decorator,
  understand chain support (Base 8453 only), contract addresses via
  getAddresses, ABIs (conduitAbi, conduitFactoryAbi,
  multiVehicleFactoryAbi, aaveV3VehicleFactoryAbi,
  accessControlFactoryAbi), enums (ConduitMode, ConduitState,
  TransferMode, EstimationType), types (Asset, ConduitInfo,
  ChainAddresses), and role constants. Load when installing railnet-sdk,
  creating a client, or importing SDK utilities.
type: core
library: railnet-sdk
library_version: '0.0.0'
sources:
  - 'railnetorg/railnet-sdk:src/index.ts'
  - 'railnetorg/railnet-sdk:src/decorator.ts'
  - 'railnetorg/railnet-sdk:src/contracts/chains.ts'
  - 'railnetorg/railnet-sdk:src/contracts/addresses.ts'
---

## Setup

Install the SDK and its required peer dependency:

```bash
npm install railnet-sdk viem
```

## Core Patterns

### Client Setup with railnetActions
The SDK extends viem clients with specialized actions for Railnet contracts.

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { railnetActions } from 'railnet-sdk'

const client = createPublicClient({
  chain: base,
  transport: http(),
}).extend(railnetActions)

// Usage
const info = await client.getConduitInfo({
  conduit: '0x1234567890123456789012345678901234567890'
})
```

### Contract Address Lookup
Retrieve factory and registry addresses for the supported Base chain.

```typescript
import { getAddresses } from 'railnet-sdk'
import { base } from 'viem/chains'

const addresses = getAddresses(base.id)
// addresses.conduitFactory
// addresses.multiVehicleFactory
// addresses.aaveV3VehicleFactory
// addresses.eacFactory              — ExternalAccessControl factory
// addresses.compoundV3VehicleFactory
// addresses.erc4626VehicleFactory
// addresses.morphoBlueVehicleFactory
// addresses.wrapperVehicleFactory
// addresses.feeManagerFactory
// addresses.modulesManagerFactory
// addresses.accountListFactory
// addresses.ownerRegistryFactory
// addresses.aavePoolAddressesProvider
// addresses.usdc                    — USDC on Base
```

### Direct ABI Usage
Use exported ABIs for custom viem calls or event listening.

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { conduitAbi } from 'railnet-sdk'

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

### Write Operations (Simulate + Write)
Always simulate before writing to catch reverts early.

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { conduitAbi } from 'railnet-sdk'

const account = privateKeyToAccount('0x...')
const publicClient = createPublicClient({ chain: base, transport: http() })
const walletClient = createWalletClient({ account, chain: base, transport: http() })

const { request } = await publicClient.simulateContract({
  address: '0x1234567890123456789012345678901234567890',
  abi: conduitAbi,
  functionName: 'deposit',
  args: [1000000n],
  account,
})

const hash = await walletClient.writeContract(request)
```

## Common Mistakes

### CRITICAL Using mainnet instead of Base

Wrong:

```typescript
import { mainnet } from 'viem/chains'
import { getAddresses } from 'railnet-sdk'

const addresses = getAddresses(mainnet.id)
```

Correct:

```typescript
import { base } from 'viem/chains'
import { getAddresses } from 'railnet-sdk'

const addresses = getAddresses(base.id)
```

`getAddresses` throws on any chain other than Base (8453). The SDK only supports Base.

Source: src/contracts/chains.ts

### HIGH Importing React hooks from wrong entry point

Wrong:

```typescript
import { useConduitPosition } from 'railnet-sdk'
```

Correct:

```typescript
import { useConduitPosition } from 'railnet-sdk/react'
```

React hooks are exported from the `railnet-sdk/react` subpath. The main entry point only exports core actions, ABIs, and utilities.

Source: package.json exports field

### CRITICAL Missing viem peer dependency

Wrong:

```bash
npm install railnet-sdk
```

Correct:

```bash
npm install railnet-sdk viem
```

`viem` is a required peer dependency. All SDK functions depend on viem types and utilities. Without it, imports fail at runtime.

Source: package.json peerDependencies

### HIGH Write actions may send multiple transactions

Wrong:

```typescript
const hash = await depositConduit(publicClient, walletClient, {
  conduit, token, amount: 1000000n, account: myAddress,
})
// Assumes one transaction for gas estimation
```

Correct:

```typescript
const hash = await depositConduit(publicClient, walletClient, {
  conduit, token, amount: 1000000n, account: myAddress,
})
// depositConduit checks allowance and sends approve tx if needed,
// then sends the deposit tx. Account for 2 possible transactions
// in gas estimation and UI loading states.
```

Write actions like `depositConduit` and `redeemConduit` auto-check ERC20 allowance and send an approval transaction before the main operation if needed. This means a single SDK call can produce two on-chain transactions.

Source: src/actions/conduit/depositConduit.ts:33-49

See also: railnet-conduit/SKILL.md
