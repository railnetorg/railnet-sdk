---
name: railnet-core
description: >
  Set up railnet-sdk with viem clients, use the railnetActions decorator,
  understand chain support (production: Ethereum 1; staging: 1 and 8453), contract addresses via
  getAddresses, ABIs (conduitAbi, conduitFactoryAbi,
  multiVehicleFactoryAbi, aaveV3VehicleFactoryAbi,
  accessControlFactoryAbi, externalAccessControlAbi,
  queueStrategyEngineAbi, sectorAccountingEngineAbi,
  vehicleManagerAbi), enums (QueryMode, QueryState,
  EstimationType), types (Asset, ConduitInfo,
  ChainAddresses), role constants, and revert handling with getRailnetError.
  Load when installing railnet-sdk, creating a client, importing SDK utilities,
  or interpreting a contract revert.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.1'
sources:
  - 'railnetorg/railnet-sdk:src/index.ts'
  - 'railnetorg/railnet-sdk:src/decorator.ts'
  - 'railnetorg/railnet-sdk:src/errors.ts'
  - 'railnetorg/railnet-sdk:src/types.ts'
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
import { mainnet } from 'viem/chains'
import { railnetActions } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(railnetActions)

// Usage — read-only actions via decorator
const info = await client.getConduitInfo({
  conduit: '0x1234567890123456789012345678901234567890'
})
```

The decorator exposes every read action the package ships: `estimateConduit`, `estimateVehicle`,
`getConduitInfo`, `getConduitPosition`, `getDepositConduitCall`, `getHasRole`,
`getInitialDepositAmount`, `getMorphoBlueSingleton`, `getMorphoMarketAsset`,
`getRedeemConduitCall`, `getVehicleManagerLimits`, `predictAccountListDeployment`,
`predictConduitDeployment`, `predictFeeManagerDeployment`, `predictOwnerRegistryDeployment` and
`simulateDispatchVehicle`. Writes are call builders, not actions: the SDK builds them and never
sends them — see railnet-conduit and railnet-vehicle skills.

### Handling reverts
`getRailnetError(error)` walks whatever viem threw, returns the decoded custom error name, its
arguments and — for the errors a caller can act on — what to do about it. It returns `null` when
the failure was not a contract revert.

```typescript
import { getRailnetError } from '@railnetorg/railnet-sdk'

try {
  await simulateContract(client, { ...call, account })
} catch (error) {
  const reverted = getRailnetError(error)
  if (reverted?.name === 'InsufficientAllowance') return approveFirst()
  throw new Error(reverted?.hint ?? 'the call failed', { cause: error })
}
```

### Contract Address Lookup
Retrieve factory and registry addresses for the supported chains (Ethereum and Base).

```typescript
import { getAddresses } from '@railnetorg/railnet-sdk'
import { mainnet } from 'viem/chains'

const addresses = getAddresses(mainnet.id)
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
import { mainnet } from 'viem/chains'
import { conduitAbi } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: mainnet,
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
Writes are builders: simulate the call, then send the request. In React the hooks simulate on `usePublicClient` and sign on `useWalletClient`.

```typescript
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const account = privateKeyToAccount('0x...')
const client = createWalletClient({ account, chain: mainnet, transport: http() })

// approve first, then deposit — the SDK does not approve for you
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({
    conduit: '0x1234567890123456789012345678901234567890',
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    amount: 1_000_000n,
    sender: account.address,
    vehicle,
    salt: randomSalt(),
  }), account: account.address })).request,
)
```

Every write is a `build*Call` builder (`buildDepositConduitCall`, `buildSpawnConduitCall`, `buildGrantScopedRoleCall`, ...). They take no client, send nothing, and return `{ address, abi, functionName, args }`. Spread it into viem to send it:

```typescript
import { buildDepositConduitCall } from '@railnetorg/railnet-sdk'

const prepared = buildDepositConduitCall({
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n,
  sender: account.address, // the address that will send it: the conduit binds the query salt to msg.sender
})

const hash = await client.writeContract({ ...prepared, account: account.address })
```

Two things the builders do NOT do: no ERC-20 approval, and no salt generation — every salt is a required parameter, so a builder is a pure function of its inputs and the same parameters always encode the same calldata. Generate salts with `randomSalt()` and keep the deployment ones: they fix the deployed address, and `buildSpawnMultiVehicleCall` takes seven at once.

Transaction overrides — gas, nonce, fees, `stateOverride` — belong to whatever sends the call, so
pass them to viem's `simulateContract` or `writeContract` alongside the spread call. The builders
take none.

### Call Builders

Every write is a `build*Call` builder. They are synchronous, take no client, and send nothing — they
return the viem contract call so you can batch it, simulate it, or route it through your own signer.
There is no other path: the SDK sends nothing, in React either.

```typescript
import { buildGrantScopedRoleCall } from '@railnetorg/railnet-sdk'

const prepared = buildGrantScopedRoleCall({
  accessControl: eacAddress,
  role: ROLE_CONDUIT_MANAGER,
  scope: conduitAddress,
  grantee: managerAddress,
})

const hash = await walletClient.writeContract({
  ...prepared,
  account,
  chain: mainnet,
})
```

A builder takes only what the call needs to be encoded, including the values a chain read would
otherwise supply — a deposit's `vehicle`, a redeem's `outputAsset`. The `get*Call` resolvers
(`getDepositConduitCall`, `getRedeemConduitCall`) do those reads and return the call ready to send,
with the identity of the query it will create. See the conduit skill for the specifics.

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
import { mainnet } from 'viem/chains'
import { getAddresses } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(mainnet.id)
```

`getAddresses` holds **production** deployments only, and throws on any other chain — including Base (8453), whose production deployment has not shipped. Use `isSupportedChain(chainId)` before calling.

Staging runs on real mainnet chain ids, so a chain id cannot tell you the environment. The import path does: `@railnetorg/railnet-sdk/staging` exports the same `getAddresses`/`isSupportedChain` over the staging tables, and holds Base today. Never mix the two in one code path.

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
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({ conduit, token, amount: 1000000n, sender: myAddress, vehicle, salt: randomSalt() }), account: myAddress })).request,
)
// Assumes the conduit is already approved
```

Correct:

```typescript
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

// approve first — the conduit pulls the token, and the allowance is spent by the deposit
await writeContract(client, {
  address: token, abi: erc20Abi, functionName: 'approve', args: [conduit, 1000000n], account: myAddress,
})

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({ conduit, token, amount: 1000000n, sender: myAddress, vehicle, salt: randomSalt() }), account: myAddress })).request,
)
// Two transactions. Account for both in gas estimation and UI loading states.
```

A deposit is two transactions: the conduit pulls the token, so it must be approved first, and the allowance is spent by the deposit. The SDK does not approve for you — an approval is a plain ERC-20 call. A redeem is one transaction: the conduit burns the caller's shares internally.

Source: src/actions/conduit/depositConduit.ts

### CRITICAL Reads and simulations do not belong on the wallet client

Wrong:

```typescript
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const { request } = await simulateContract(walletClient, {
  ...buildDepositConduitCall({
  conduit, token, amount: 1000000n, sender: myAddress,
})
```

Correct:

```typescript
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const { request } = await simulateContract(publicClient, {
  ...buildDepositConduitCall({ conduit, token, amount: 1000000n, sender: myAddress, vehicle, salt: randomSalt() }),
  account: myAddress,
})
const hash = await writeContract(walletClient, request)
```

Every write is a `build*Call` builder returning `{ address, abi, functionName, args }`. Simulate it, then send the request:

```typescript
const { request } = await simulateContract(client, { ...buildEnableConduitTransfersCall({ conduit }), account })
const hash = await writeContract(client, request)
```

In React the hooks do this for you, and they simulate on `usePublicClient` rather than on the wallet: a wallet answers reads from whatever node it picked, at whatever freshness it keeps, so a preflight sent there can reject a valid call.

Source: src/actions/conduit/depositConduit.ts:27-30

See also: railnet-conduit/SKILL.md
