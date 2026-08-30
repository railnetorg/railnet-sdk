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
Retrieve factory and registry addresses for the supported Base chain.

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

### Write Operations (Single-Client Pattern)
All write actions use a single-client pattern: pass a wallet client that handles both simulation and signing internally.

```typescript
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { depositConduit } from '@railnetorg/railnet-sdk'

const account = privateKeyToAccount('0x...')
const client = createWalletClient({ account, chain: base, transport: http() })

const hash = await depositConduit(client, {
  conduit: '0x1234567890123456789012345678901234567890',
  token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amount: 1_000_000n,
  account: account.address,
})
```

Every write action also has a `prepare*` counterpart (`prepareDepositConduit`, `prepareSpawnConduit`, `prepareGrantScopedRole`, ...). They take no client, send nothing, and return `PreparedWrite` (`{ address, abi, functionName, args }`) to spread into viem yourself:

```typescript
import { prepareDepositConduit } from '@railnetorg/railnet-sdk'

const prepared = prepareDepositConduit({
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n,
  account: account.address, // required: the conduit binds the query salt to the sender
})

const hash = await client.writeContract({ ...prepared, account: account.address })
```

Two things the builders do NOT do: no ERC-20 approval (the execute actions send one when the allowance is short), and no salt generation — every salt is a required parameter, so a builder is a pure function of its inputs and the same parameters always encode the same calldata. Generate salts with `randomSalt()` and keep the deployment ones: they fix the deployed address, and `prepareSpawnMultiVehicle` takes seven at once.

All write actions accept an optional third `options` parameter of type `ContractCallOptions` for gas, nonce, and other overrides:

```typescript
type ContractCallOptions = {
  gas?: bigint
  nonce?: number
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  accessList?: AccessList
  stateOverride?: StateOverride
  dataSuffix?: Hex
}
```

### Prepared Writes

Every write action has a `prepare*` counterpart. They are synchronous, take no client, and send
nothing — they return the viem contract call so you can batch it, simulate it, or route it through
your own signer. The execute action builds on the same builder, so both paths encode an identical
call.

```typescript
import { prepareGrantScopedRole } from '@railnetorg/railnet-sdk'

const prepared = prepareGrantScopedRole({
  accessControl: eacAddress,
  role: ROLE_CONDUIT_MANAGER,
  scope: conduitAddress,
  grantee: managerAddress,
})

const hash = await walletClient.writeContract({
  ...prepared,
  account,
  chain: base,
})
```

Most `prepare*` take the same parameters as their execute counterpart. The exceptions are the ones
whose execute action reads chain state first: because `prepare*` is synchronous it cannot perform
that read, so those values become required parameters. See the conduit skill for the specifics.

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

`getAddresses` throws on any chain other than Base (8453). The SDK only supports Base. Use `isSupportedChain(chainId)` to check before calling.

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

### HIGH Write actions may send multiple transactions

Wrong:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(client, {
  conduit, token, amount: 1000000n, account: myAddress,
})
// Assumes one transaction for gas estimation
```

Correct:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(client, {
  conduit, token, amount: 1000000n, account: myAddress,
})
// depositConduit checks allowance and sends approve tx if needed,
// then sends the deposit tx. Account for 2 possible transactions
// in gas estimation and UI loading states.
```

`depositConduit` auto-checks the ERC20 allowance and sends an approval transaction before the deposit if needed, so a single SDK call can produce two on-chain transactions. `redeemConduit` does not: the conduit burns the caller's shares internally, so redeeming is always one transaction.

Source: src/actions/conduit/depositConduit.ts:36-54

### CRITICAL Write actions use a single client, not two

Wrong:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(publicClient, walletClient, {
  conduit, token, amount: 1000000n, account: myAddress,
})
```

Correct:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(walletClient, {
  conduit, token, amount: 1000000n, account: myAddress,
})
```

All write actions take `(client, parameters, options?)` — a single viem client (typically a wallet client) that handles both simulation and signing. Do not pass two separate clients.

Source: src/actions/conduit/depositConduit.ts:27-30

See also: railnet-conduit/SKILL.md
