---
name: railnet-conduit
description: >
  Interact with Railnet Conduits — depositConduit, redeemConduit,
  getConduitPosition, getConduitInfo, estimateConduit,
  predictConduitDeployment, prepareSpawnConduit, prepareEnableConduit,
  prepareFinalizeConduitDeposit, processConduitQuery. Covers deposits,
  redemptions, position reads, estimates, async query lifecycle,
  and conduit deployment. Load when working with conduit operations.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.1'
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

// Wallet client signs; the public client above simulates and reads
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
import { extractConduitAddress, getInitialDepositAmount, predictConduitDeployment, prepareEnableConduit, prepareSpawnConduit, simulateThenWrite } from '@railnetorg/railnet-sdk'
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

  // querySalt and deploymentSalt are required; deploymentSalt fixes the conduit address
  const hash = await simulateThenWrite(
    { publicClient, walletClient },
    prepareSpawnConduit(params),
    walletClient.account.address,
  )
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  
  const conduit = extractConduitAddress(receipt, factory)
  
  if (conduit) {
    await simulateThenWrite(
  { publicClient, walletClient },
  prepareEnableConduit({ 
      conduit, 
      account: walletClient.account.address 
    }),
  account.address,
)
  }
}
```

### Depositing and Redeeming

A deposit is two transactions. The conduit pulls the token, so it must be approved first, and the
allowance is spent by the deposit — a later deposit of the same size needs a new approval. The SDK
does not approve for you.

```typescript
import { erc20Abi } from 'viem'
import { readContract, simulateContract, waitForTransactionReceipt, writeContract } from 'viem/actions'
import { conduitAbi, prepareDepositConduit, prepareRedeemConduit, randomSalt, simulateThenWrite } from '@railnetorg/railnet-sdk'

const clients = { publicClient, walletClient }

// 1. approve — a plain ERC-20 call, nothing Railnet-specific
const approveHash = await writeContract(walletClient, {
  address: usdcAddress,
  abi: erc20Abi,
  functionName: 'approve',
  args: [conduitAddress, 1_000_000n],
  account: account.address,
})
await waitForTransactionReceipt(publicClient, { hash: approveHash })

// 2. deposit — calls conduit.create() with a DEPOSIT query
const vehicle = await readContract(publicClient, {
  address: conduitAddress,
  abi: conduitAbi,
  functionName: 'getVehicle',
})

const depositHash = await simulateThenWrite(
  clients,
  prepareDepositConduit({
    conduit: conduitAddress,
    token: usdcAddress,
    amount: 1_000_000n, // 1 USDC (6 decimals)
    account: account.address,
    vehicle, // names the query's output asset; the deposit reverts without it
    salt: randomSalt(),
    // receiver optional — defaults to account
    // minOutput optional — a floor on the vehicle shares produced
  }),
  account.address,
)

// Redeem: no approval, the conduit burns the caller's shares.
// Calls conduit.createRedeemFromConduitShares().
const asset = await readContract(publicClient, {
  address: conduitAddress,
  abi: conduitAbi,
  functionName: 'asset',
})

const redeemHash = await simulateThenWrite(
  clients,
  prepareRedeemConduit({
    conduit: conduitAddress,
    shares: 500_000n,
    account: account.address,
    outputAsset: { asset, value: 0n }, // value is a floor; 0n sets none
    salt: randomSalt(),
  }),
  account.address,
)
```

### Prepared Writes

`prepareDepositConduit`, `prepareRedeemConduit`, `prepareSpawnConduit`, `prepareEnableConduit`,
`prepareFinalizeConduitDeposit` and `prepareProcessConduitQuery` return the viem contract call
without sending it — synchronous, no client. Use them to batch, simulate, or sign elsewhere.

The deposit and redeem builders require more than their execute counterparts, because the execute
action derives those values from a chain read that a synchronous builder cannot perform:

```typescript
import { prepareDepositConduit, randomSalt, simulateThenWrite } from '@railnetorg/railnet-sdk'

const prepared = prepareDepositConduit({
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n,
  account: account.address,
  vehicle: vehicleAddress, // required here; depositConduit reads it from the conduit
  salt: randomSalt(), // required here; depositConduit defaults it
})

const hash = await walletClient.writeContract({ ...prepared, account, chain: base })
```

`prepareRedeemConduit` likewise requires `outputAsset` and `salt`, which `redeemConduit` fills from
`conduit.asset()` and `randomSalt()`. A prepared deposit also skips the ERC-20 approval that
`depositConduit` sends for you — approve separately before submitting.

### Handling Async Queries (Ethena/Syrup)

When the underlying vehicle is async, `create()` returns state PROCESSING (not UNLOCKING). The query must be processed later once the vehicle settles.

Note: `create()` never produces REJECTED or RECOVERING — validation failures always revert. If `create()` succeeds, the query is in PROCESSING or UNLOCKING.

```typescript
import { prepareProcessConduitQuery, simulateThenWrite, type ConduitMode } from '@railnetorg/railnet-sdk'
import { encodeAbiParameters, keccak256 } from 'viem'
import type { Address, Hex } from 'viem'

// The query struct must match exactly what was used to create the query.
// Save these values from the original depositConduit/redeemConduit call.
// query.salt is not the salt you passed in: the conduit derives it as
// keccak256(abi.encode(depositor, sourceSalt)). Rebuild it the same way.
const query = {
  owner: conduitAddress as Address,
  receiver: conduitAddress as Address,
  input: { asset: tokenAddress, value: depositAmount },
  output: { asset: zeroAddress, value: 0n },
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
const hash = await simulateThenWrite(
  { publicClient, walletClient },
  prepareProcessConduitQuery({
      conduit: conduitAddress,
      query,
      account: account.address,
    }),
  account.address,
)

await publicClient.waitForTransactionReceipt({ hash })
```

### Finalizing Async Conduit Deployment

When spawning a conduit on an async vehicle, the initial deposit remains pending. After the vehicle settles the initial query, call `finalizeConduitDeposit` on the **factory** (not the conduit) to burn initial shares and enable public access.

```typescript
import { getAddresses, prepareFinalizeConduitDeposit, simulateThenWrite } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

const hash = await simulateThenWrite(
  { publicClient, walletClient },
  prepareFinalizeConduitDeposit({
      factory: addresses.conduitFactory,
      conduit: conduitAddress,
      account: account.address,
    }),
  account.address,
)
```

Source: src/actions/conduit/finalizeConduitDeposit.ts

## Common Mistakes

### CRITICAL Reads and simulations do not belong on the wallet client

Wrong:

```typescript
const { request } = await simulateContract(walletClient, {
  ...prepareDepositConduit({ /* … */ }),
  account,
})
```

Correct:

```typescript
const hash = await simulateThenWrite(
  { publicClient, walletClient },
  prepareDepositConduit({ /* … */ }),
  account,
)
```

A wallet client's transport is the wallet itself, so it answers reads from whatever node it picked,
at whatever freshness it keeps — one was observed pinned to a block from before the approval was
sent, which made the deposit simulate against a spent allowance and revert on state already on
chain. `simulateThenWrite` simulates on the public client and signs on the wallet. Only signing
needs the wallet.

A script with one client passes it as both: `{ publicClient: client, walletClient: client }`.

Source: src/utils/simulateThenWrite.ts

### CRITICAL Forgetting account parameter on write actions

Wrong:

```typescript
prepareDepositConduit({
  conduit: '0x...', token: '0x...', amount: 1000000n, vehicle: '0x...', salt: randomSalt(),
})
```

Correct:

```typescript
prepareDepositConduit({
  conduit: '0x...', token: '0x...', amount: 1000000n, account: '0xYourAddress',
  vehicle: '0x...', salt: randomSalt(),
})
```

The builders take `account` because the query salt is derived from it, and `simulateThenWrite` takes it again for the simulation. Without it, simulation fails with a cryptic viem error about a missing account.

Source: src/actions/conduit/depositConduit.ts:29

### HIGH Using estimate for share valuation instead of position

Wrong:

```typescript
import { estimateConduit, ConduitMode, EstimationType } from '@railnetorg/railnet-sdk'

const estimated = await estimateConduit(client, {
  conduit, asset: { asset: conduit, value: shares },
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
const hash = await simulateThenWrite(
  { publicClient, walletClient },
  prepareDepositConduit({ conduit, token, amount: 1000000n, account, vehicle, salt: randomSalt() }),
  account,
)
// Assumes deposit is settled immediately
```

Correct:

```typescript
const hash = await simulateThenWrite(
  { publicClient, walletClient },
  prepareDepositConduit({ conduit, token, amount: 1000000n, account, vehicle, salt: randomSalt() }),
  account,
)
// For async vehicles (Ethena, Syrup): deposit enters PROCESSING state.
// Monitor vehicle Updated events or poll vehicle.state(query).
// When state reaches UNLOCKING, call:
await simulateThenWrite(
  { publicClient, walletClient },
  prepareProcessConduitQuery({ conduit, query, account }),
  account.address,
)
```

When the underlying vehicle is async, the deposit/redeem creates a query in PROCESSING state. Settlement requires calling `prepareProcessConduitQuery` after the vehicle reaches UNLOCKING.

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
