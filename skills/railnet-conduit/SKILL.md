---
name: railnet-conduit
description: >
  Interact with Railnet Conduits — depositConduit, redeemConduit,
  getConduitPosition, getConduitInfo, estimateConduit,
  predictConduitDeployment, spawnConduit, enableConduit,
  finalizeConduitDeposit, processConduitQuery. Covers deposits,
  redemptions, position reads, estimates, async query lifecycle,
  and conduit deployment. Load when working with conduit operations.
type: core
library: railnet-sdk
library_version: '0.0.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/conduit/*.ts'
---

# Railnet Conduit Operations

## Setup

```typescript
import { createPublicClient, createWalletClient, http, publicActions } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Read-only client (for getConduitInfo, getConduitPosition, etc.)
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

// Read+write client (for depositConduit, redeemConduit, spawnConduit, etc.)
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const client = createWalletClient({
  account,
  chain: base,
  transport: http(),
}).extend(publicActions)
```

## Core Patterns

### Reading Conduit State

```typescript
import { getConduitInfo, getConduitPosition } from 'railnet-sdk';
import type { Address } from 'viem';

async function checkPosition(conduit: Address, user: Address) {
  const info = await getConduitInfo(publicClient, { conduit });
  const position = await getConduitPosition(publicClient, { 
    conduit, 
    account: user 
  });

  console.log(`Conduit: ${info.name} (${info.symbol})`);
  console.log(`User Shares: ${position.shares}`);
  console.log(`User Assets: ${position.assets}`);
}
```

### Spawning and Enabling a Conduit

```typescript
import { 
  spawnConduit, 
  enableConduit, 
  predictConduitDeployment, 
  extractConduitAddress,
  TransferMode 
} from 'railnet-sdk';

async function deployNewConduit() {
  const factory = '0x...';
  const params = {
    factory,
    name: 'My Conduit',
    symbol: 'MYC',
    vehicle: '0x...',
    feeManager: '0x...',
    accountList: '0x...',
    ownerRegistry: '0x...',
    accessControl: '0x...',
    transferMode: TransferMode.ACCOUNT_LIST,
    initialDepositSize: 1000000n,
    initialExpectedSupply: 1000000n,
    depositAsset: '0x...',
    account: walletClient.account.address,
  };

  const predicted = await predictConduitDeployment(publicClient, params);
  const hash = await spawnConduit(client, params);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  const conduit = extractConduitAddress(receipt, factory);
  
  if (conduit) {
    await enableConduit(client, { 
      conduit, 
      account: client.account.address 
    });
  }
}
```

### Depositing and Redeeming

```typescript
import { depositConduit, redeemConduit } from 'railnet-sdk'
import type { Address } from 'viem'

// Deposit: Auto-checks allowance and sends approve if needed.
// Internally calls conduit.create() with a DEPOSIT query.
const depositHash = await depositConduit(client, {
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n, // 1 USDC (6 decimals)
  account: account.address,
})

// Redeem: Auto-checks allowance on conduit shares.
// Internally calls conduit.createRedeemFromConduitShares().
const redeemHash = await redeemConduit(client, {
  conduit: conduitAddress,
  shares: 500_000n,
  // outputAssets is optional — defaults to [].
  // Pass specific assets to control which tokens you receive back.
  account: account.address,
})
```

### Handling Async Queries (Ethena/Syrup)

When the underlying vehicle is async, `create()` returns state PROCESSING (not UNLOCKING). The query must be processed later once the vehicle settles.

Note: `create()` never produces REJECTED or RECOVERING — validation failures always revert. If `create()` succeeds, the query is in PROCESSING or UNLOCKING.

```typescript
import { processConduitQuery, type ConduitMode } from 'railnet-sdk'
import type { Address, Hex } from 'viem'

// The query struct must match exactly what was used to create the query.
// Save these values from the original depositConduit/redeemConduit call.
const query = {
  owner: conduitAddress as Address,
  receiver: conduitAddress as Address,
  input: [{ asset: tokenAddress, value: depositAmount }],
  output: [] as { asset: Address; value: bigint }[],
  mode: 0 as ConduitMode, // ConduitMode.DEPOSIT
  salt: originalSalt as Hex,
  data: '0x' as Hex,
}

// Call once the vehicle reaches UNLOCKING state
const hash = await processConduitQuery(client, {
  conduit: conduitAddress,
  query,
  account: account.address,
})

await publicClient.waitForTransactionReceipt({ hash })
```

### Finalizing Async Conduit Deployment

When spawning a conduit on an async vehicle, the initial deposit remains pending. After the vehicle settles the initial query, call `finalizeConduitDeposit` on the **factory** (not the conduit) to burn initial shares and enable public access.

```typescript
import { finalizeConduitDeposit, getAddresses } from 'railnet-sdk'

const addresses = getAddresses(base.id)

const hash = await finalizeConduitDeposit(client, {
  factory: addresses.conduitFactory,
  conduit: conduitAddress,
  account: account.address,
})
```

Source: src/actions/conduit/finalizeConduitDeposit.ts

## Common Mistakes

### CRITICAL Write actions need a client with both read and write capabilities

Wrong:

```typescript
import { createPublicClient, http } from 'viem'
import { depositConduit } from 'railnet-sdk'

const client = createPublicClient({ chain: base, transport: http() })
const hash = await depositConduit(client, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0x...',
})
// Fails at runtime — publicClient has no wallet/signing capabilities
```

Correct:

```typescript
import { createWalletClient, http, publicActions } from 'viem'
import { depositConduit } from 'railnet-sdk'

const client = createWalletClient({ account, chain: base, transport: http() })
  .extend(publicActions)

const hash = await depositConduit(client, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0x...',
})
```

All write actions take `(client, params)` — the client must support both simulation (read) and signing (write).

Source: src/actions/conduit/depositConduit.ts:19-21

### CRITICAL Forgetting account parameter on write actions

Wrong:

```typescript
await depositConduit(client, {
  conduit: '0x...', token: '0x...', amount: 1000000n,
})
```

Correct:

```typescript
await depositConduit(client, {
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0xYourAddress',
})
```

Write actions require `{ account: Address }` merged into params. Without it, simulation fails with a cryptic viem error about missing account.

Source: src/actions/conduit/depositConduit.ts:27

### HIGH Using estimate for share valuation instead of position

Wrong:

```typescript
import { estimateConduit, ConduitMode, EstimationType } from 'railnet-sdk'

const estimated = await estimateConduit(client, {
  conduit, assets: [{ asset: conduit, value: shares }],
  mode: ConduitMode.REDEEM, estimationType: EstimationType.OUTPUT,
})
```

Correct:

```typescript
import { getConduitPosition } from 'railnet-sdk'

const position = await getConduitPosition(client, { conduit, account })
console.log(position.assets)
```

`estimateConduit` includes fees in its calculation. For fee-free share-to-asset conversion, use `getConduitPosition` which calls `convert()` internally.

Source: Protocol docs — estimate() vs convert()

### HIGH Not handling async conduit queries

Wrong:

```typescript
const hash = await depositConduit(client, {
  conduit, token, amount: 1000000n, account,
})
// Assumes deposit is settled immediately
```

Correct:

```typescript
const hash = await depositConduit(client, {
  conduit, token, amount: 1000000n, account,
})
// For async vehicles (Ethena, Syrup): deposit enters PROCESSING state.
// Monitor vehicle Updated events or poll vehicle.state(query).
// When state reaches UNLOCKING, call:
await processConduitQuery(client, { conduit, query, account })
```

When the underlying vehicle is async, the deposit/redeem creates a query in PROCESSING state. Settlement requires calling `processConduitQuery` after the vehicle reaches UNLOCKING.

Source: src/actions/conduit/processConduitQuery.ts

### HIGH Using raw TransferMode numbers instead of SDK enum

Wrong:

```typescript
const params = {
  transferMode: 1,
}
```

Correct:

```typescript
import { TransferMode } from 'railnet-sdk'

const params = {
  transferMode: TransferMode.ALLOW_TRANSFER,
}
```

TransferMode enum ordering (ACCOUNT_LIST=0, ALLOW_TRANSFER=1, BLOCK_TRANSFER=2) differs from what protocol docs may suggest. Always use the SDK enum to avoid silent misconfiguration.

Source: src/actions/conduit/types.ts:3-7

### HIGH depositConduit sends two transactions silently

`depositConduit` checks ERC20 allowance and sends an approve transaction before the deposit if needed. A single SDK call can produce two on-chain transactions. Account for this in gas estimation and UI loading states.

Source: src/actions/conduit/depositConduit.ts:33-49

See also: railnet-core/SKILL.md § Common Mistakes

## References

- [Error Reference](references/error-reference.md)

See also: railnet-access-control/SKILL.md — spawning a conduit requires an EAC address, and conduit operations may fail with `MissingRole` if `VEHICLE_STEAM` is not granted.

See also: railnet-react/SKILL.md — React hooks wrap these core actions.
