---
name: railnet-conduit
description: >
  Interact with Railnet Conduits — depositConduit, redeemConduit,
  getConduitPosition, getConduitInfo, estimateConduit,
  predictConduitDeployment, spawnConduit, enableConduit,
  finalizeConduitDeposit, processConduitQuery. Covers deposits,
  redemptions, position reads, estimates, async query lifecycle,
  and conduit deployment. Load when working with conduit operations.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.1.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/conduit/*.ts'
---

# Railnet Conduit Operations

## Setup

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Read-only client for queries
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

// Wallet client for write actions (handles both simulation and signing)
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
})
```

## Core Patterns

### Reading Conduit State

```typescript
import { getConduitInfo, getConduitPosition } from '@railnetorg/railnet-sdk'
import type { Address } from 'viem'

async function checkPosition(conduit: Address, user: Address) {
  const info = await getConduitInfo(publicClient, { conduit })
  const position = await getConduitPosition(publicClient, { 
    conduit, 
    account: user 
  })

  console.log(`Conduit: ${info.name} (${info.symbol})`)
  console.log(`Decimals: ${info.decimals}`)
  console.log(`Total Supply: ${info.totalSupply}`)
  console.log(`Total Assets: ${info.totalAssets}`)
  console.log(`Holdings: ${info.holdings}`)
  console.log(`User Shares: ${position.shares}`)
  console.log(`User Assets: ${position.assets}`)
}
```

### Spawning and Enabling a Conduit

```typescript
import { 
  spawnConduit, 
  enableConduit, 
  predictConduitDeployment, 
  extractConduitAddress,
  getInitialDepositAmount,
} from '@railnetorg/railnet-sdk'
import { erc20Abi } from 'viem'

async function deployNewConduit() {
  const factory = '0x...'
  const params = {
    factory,
    name: 'My Conduit',
    symbol: 'MYC',
    vehicle: '0x...',
    feeManager: '0x...',
    accountList: '0x...',
    ownerRegistry: '0x...',
    accessControl: '0x...',
    transferEnabled: false,
    initialExpectedSupply: 1000000n,
    account: walletClient.account.address,
    // Optional: initialInterceptions — Array<{ asset, recipients:
    //   Array<{ target, shareBps, chainId }> }>
  }

  // The factory pulls an initial deposit sized by the AssetRegistry — approve it first
  const initialDepositAmount = await getInitialDepositAmount(walletClient, {
    assetRegistry: addresses.assetRegistry,
    asset: vehicleAsset,
  })
  await walletClient.writeContract({
    address: vehicleAsset,
    abi: erc20Abi,
    functionName: 'approve',
    args: [factory, initialDepositAmount],
    account: walletClient.account.address,
  })

  // spawnConduit auto-generates querySalt and deploymentSalt if not provided
  const hash = await spawnConduit(walletClient, params)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  
  const conduit = extractConduitAddress(receipt, factory)
  
  if (conduit) {
    await enableConduit(walletClient, { 
      conduit, 
      account: walletClient.account.address 
    })
  }
}
```

### Depositing and Redeeming

```typescript
import { depositConduit, redeemConduit } from '@railnetorg/railnet-sdk'
import type { Address } from 'viem'

// Deposit: Auto-checks allowance and sends approve if needed.
// Internally calls conduit.create() with a DEPOSIT query.
const depositHash = await depositConduit(walletClient, {
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n, // 1 USDC (6 decimals)
  account: account.address,
  // receiver is optional — defaults to account
  // salt is optional — auto-generated
})

// Redeem: Auto-checks allowance on conduit shares.
// Internally calls conduit.createRedeemFromConduitShares().
const redeemHash = await redeemConduit(walletClient, {
  conduit: conduitAddress,
  shares: 500_000n,
  // outputAssets is optional — defaults to [].
  // Pass specific assets to control which tokens you receive back.
  // receiver is optional — defaults to account
  account: account.address,
})
```

### Handling Async Queries (Ethena/Syrup)

When the underlying vehicle is async, `create()` returns state PROCESSING (not UNLOCKING). The query must be processed later once the vehicle settles.

Note: `create()` never produces REJECTED or RECOVERING — validation failures always revert. If `create()` succeeds, the query is in PROCESSING or UNLOCKING.

```typescript
import { processConduitQuery, type ConduitMode } from '@railnetorg/railnet-sdk'
import { encodeAbiParameters, keccak256 } from 'viem'
import type { Address, Hex } from 'viem'

// The query struct must match exactly what was used to create the query.
// Save these values from the original depositConduit/redeemConduit call.
// query.salt is not the salt you passed in: the conduit derives it as
// keccak256(abi.encode(depositor, sourceSalt)). Rebuild it the same way.
const query = {
  owner: conduitAddress as Address,
  receiver: conduitAddress as Address,
  input: [{ asset: tokenAddress, value: depositAmount }],
  output: [] as { asset: Address; value: bigint }[],
  mode: 0 as ConduitMode, // ConduitMode.DEPOSIT
  salt: keccak256(
    encodeAbiParameters(
      [{ type: 'address' }, { type: 'bytes32' }],
      [account.address, originalSalt as Hex],
    ),
  ),
  data: '0x' as Hex,
}

// Call once the vehicle reaches UNLOCKING state
const hash = await processConduitQuery(walletClient, {
  conduit: conduitAddress,
  query,
  account: account.address,
})

await publicClient.waitForTransactionReceipt({ hash })
```

### Finalizing Async Conduit Deployment

When spawning a conduit on an async vehicle, the initial deposit remains pending. After the vehicle settles the initial query, call `finalizeConduitDeposit` on the **factory** (not the conduit) to burn initial shares and enable public access.

```typescript
import { finalizeConduitDeposit, getAddresses } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

const hash = await finalizeConduitDeposit(walletClient, {
  factory: addresses.conduitFactory,
  conduit: conduitAddress,
  account: account.address,
})
```

Source: src/actions/conduit/finalizeConduitDeposit.ts

## Common Mistakes

### CRITICAL Write actions take a single client, not two

Wrong:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(publicClient, walletClient, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0x...',
})
```

Correct:

```typescript
import { depositConduit } from '@railnetorg/railnet-sdk'

const hash = await depositConduit(walletClient, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0x...',
})
```

All write actions take `(client, parameters, options?)` — a single viem client (typically a wallet client) that handles both simulation and signing internally via `simulateContract` + `writeContract`.

Source: src/actions/conduit/depositConduit.ts:27-31

### CRITICAL Forgetting account parameter on write actions

Wrong:

```typescript
await depositConduit(walletClient, {
  conduit: '0x...', token: '0x...', amount: 1000000n,
})
```

Correct:

```typescript
await depositConduit(walletClient, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0xYourAddress',
})
```

Write actions require `{ account: Address }` merged into params. Without it, simulation fails with a cryptic viem error about missing account.

Source: src/actions/conduit/depositConduit.ts:29

### HIGH Using estimate for share valuation instead of position

Wrong:

```typescript
import { estimateConduit, ConduitMode, EstimationType } from '@railnetorg/railnet-sdk'

const estimated = await estimateConduit(client, {
  conduit, assets: [{ asset: conduit, value: shares }],
  mode: ConduitMode.REDEEM, estimationType: EstimationType.OUTPUT,
})
```

Correct:

```typescript
import { getConduitPosition } from '@railnetorg/railnet-sdk'

const position = await getConduitPosition(client, { conduit, account })
console.log(position.assets)
```

`estimateConduit` includes fees in its calculation. For fee-free share-to-asset conversion, use `getConduitPosition` which calls `convert()` internally.

Source: Protocol docs — estimate() vs convert()

### HIGH Not handling async conduit queries

Wrong:

```typescript
const hash = await depositConduit(walletClient, {
  conduit, token, amount: 1000000n, account,
})
// Assumes deposit is settled immediately
```

Correct:

```typescript
const hash = await depositConduit(walletClient, {
  conduit, token, amount: 1000000n, account,
})
// For async vehicles (Ethena, Syrup): deposit enters PROCESSING state.
// Monitor vehicle Updated events or poll vehicle.state(query).
// When state reaches UNLOCKING, call:
await processConduitQuery(walletClient, { conduit, query, account })
```

When the underlying vehicle is async, the deposit/redeem creates a query in PROCESSING state. Settlement requires calling `processConduitQuery` after the vehicle reaches UNLOCKING.

Source: src/actions/conduit/processConduitQuery.ts

### HIGH Using the removed transferMode enum instead of transferEnabled

Wrong:

```typescript
const params = {
  transferMode: 1,
}
```

Correct:

```typescript
const params = {
  transferEnabled: true,
}
```

`spawnConduit` takes a `transferEnabled: boolean` — share transfers are either on or off. The old `transferMode` enum (`ACCOUNT_LIST`/`ALLOW_TRANSFER`/`BLOCK_TRANSFER`) and the `depositAsset`/`initialDepositSize` fields have been removed.

Source: src/actions/conduit/types.ts

### HIGH depositConduit sends two transactions silently

`depositConduit` checks ERC20 allowance and sends an approve transaction before the deposit if needed. A single SDK call can produce two on-chain transactions. Account for this in gas estimation and UI loading states.

Source: src/actions/conduit/depositConduit.ts:36-54

See also: railnet-core/SKILL.md § Common Mistakes

## References

- [Error Reference](references/error-reference.md)

See also: railnet-access-control/SKILL.md — spawning a conduit requires an EAC address, and conduit operations may fail with `MissingRole` if `VEHICLE_STEAM_DEPOSIT` or `VEHICLE_STEAM_REDEEM` is not granted.

See also: railnet-react/SKILL.md — React hooks wrap these core actions.
