---
name: railnet-conduit
description: >
  Interact with Railnet Conduits — depositConduit, redeemConduit,
  getConduitPosition, getConduitInfo, estimateConduit,
  predictConduitDeployment, buildSpawnConduitCall, buildEnableConduitCall,
  buildFinalizeConduitDepositCall, processConduitQuery. Covers deposits,
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
import { extractConduitAddress, getInitialDepositAmount, predictConduitDeployment, buildEnableConduitCall, buildSpawnConduitCall } from '@railnetorg/railnet-sdk'
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
  const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnConduitCall(params), account: walletClient.account.address })).request,
)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  
  const conduit = extractConduitAddress(receipt, factory)
  
  if (conduit) {
    writeContract(
  client,
  (await simulateContract(client, { ...buildEnableConduitCall({ 
      conduit, 
      account: walletClient.account.address 
    }), account: account.address })).request,
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
import { conduitAbi, buildDepositConduitCall, buildRedeemConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

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

const depositHash = writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildDepositConduitCall({
    conduit: conduitAddress,
    token: usdcAddress,
    amount: 1_000_000n, // 1 USDC (6 decimals)
    sender: account.address,
    vehicle, // names the query's output asset; the deposit reverts without it
    salt: randomSalt(),
    // receiver optional — defaults to sender
    // minOutput optional — a floor on the VEHICLE shares produced, from estimateVehicle + applySlippage
  }),
    account: account.address,
  })).request,
)

// Redeem: no approval, the conduit burns the caller's shares.
// Calls conduit.createRedeemFromConduitShares().
const asset = await readContract(publicClient, {
  address: conduitAddress,
  abi: conduitAbi,
  functionName: 'asset',
})

const redeemHash = writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildRedeemConduitCall({
    conduit: conduitAddress,
    shares: 500_000n,
    sender: account.address,
    outputAsset: { asset, value: 0n }, // value is a floor; 0n sets none
    salt: randomSalt(),
  }),
    account: account.address,
  })).request,
)
```

### Resolving a call, and the query's identity

`getDepositConduitCall(client, parameters)` and `getRedeemConduitCall(client, parameters)` do the
chain reads a synchronous builder cannot — the vehicle, the underlying asset — and hand back the
identity of the query the call will create:

```typescript
import { getDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const { call, queryId } = await getDepositConduitCall(publicClient, {
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n,
  sender: account.address,
  salt: randomSalt(),
})
```

`queryId` is `keccak256(abi.encode(chainId, vehicle, query))` — the value the conduit emits in
`QueryCreated`, and the key an indexer holds. It is known **before** the transaction is sent,
because a deposit's query is built off chain.

A redeem's is not: the conduit assembles that query at the share ratio of the including block, so
`getRedeemConduitCall` returns `querySalt` (`keccak256(abi.encode(sender, salt))`, a field of the
created query) and `extractQueryIds(receipt, conduit)` reads the id back from the receipt.

Keep the salt for as long as the operation lasts. A retry with a fresh salt is not a retry, it is a
second query with a different id.

### Call Builders

`buildDepositConduitCall`, `buildRedeemConduitCall`, `buildSpawnConduitCall`, `buildEnableConduitCall`,
`buildFinalizeConduitDepositCall` and `buildProcessConduitQueryCall` return the viem contract call
without sending it — synchronous, no client. Use them to batch, simulate, or sign elsewhere.

The deposit and redeem builders take what a synchronous builder cannot read for itself:

```typescript
import { buildDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'

const prepared = buildDepositConduitCall({
  conduit: conduitAddress,
  token: usdcAddress,
  amount: 1_000_000n,
  sender: account.address,
  vehicle: vehicleAddress, // required here; depositConduit reads it from the conduit
  salt: randomSalt(), // required here; depositConduit defaults it
})

const hash = await walletClient.writeContract({ ...prepared, account, chain: base })
```

`buildRedeemConduitCall` likewise requires `outputAsset` and `salt`, which `redeemConduit` fills from
`conduit.asset()` and `randomSalt()`. A prepared deposit also skips the ERC-20 approval that
`depositConduit` sends for you — approve separately before submitting.

### Handling Async Queries (Ethena/Syrup)

When the underlying vehicle is async, `create()` returns state PROCESSING (not UNLOCKING). The query must be processed later once the vehicle settles.

Note: `create()` never produces REJECTED or RECOVERING — validation failures always revert. If `create()` succeeds, the query is in PROCESSING or UNLOCKING.

```typescript
import { buildProcessConduitQueryCall, type ConduitMode } from '@railnetorg/railnet-sdk'
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
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildProcessConduitQueryCall({
      conduit: conduitAddress,
      query,
      account: account.address,
    }), account: account.address })).request,
)

await publicClient.waitForTransactionReceipt({ hash })
```

### Finalizing Async Conduit Deployment

When spawning a conduit on an async vehicle, the initial deposit remains pending. After the vehicle settles the initial query, call `finalizeConduitDeposit` on the **factory** (not the conduit) to burn initial shares and enable public access.

```typescript
import { getAddresses, buildFinalizeConduitDepositCall } from '@railnetorg/railnet-sdk'

const addresses = getAddresses(base.id)

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildFinalizeConduitDepositCall({
      factory: addresses.conduitFactory,
      conduit: conduitAddress,
      account: account.address,
    }), account: account.address })).request,
)
```

Source: src/actions/conduit/finalizeConduitDeposit.ts

## Common Mistakes

### CRITICAL Reads and simulations do not belong on the wallet client

Wrong:

```typescript
const { request } = await simulateContract(walletClient, {
  ...buildDepositConduitCall({ /* … */ }),
  account,
})
```

Correct:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({ /* … */ }), account: account })).request,
)
```

A wallet client's transport is the wallet itself, so it answers reads from whatever node it picked,
at whatever freshness it keeps — one was observed pinned to a block from before the approval was
sent, which made the deposit simulate against a spent allowance and revert on state already on
chain. Simulate on the public client, then send the request with the wallet. Only signing needs the
wallet.

A script with a single client uses it for both, which is fine: it chose that client's transport.

Source: src/actions/conduit/getDepositConduitCall.ts

### CRITICAL Forgetting the sender parameter on a deposit or redeem

Wrong:

```typescript
buildDepositConduitCall({
  conduit: '0x...', token: '0x...', amount: 1000000n, vehicle: '0x...', salt: randomSalt(),
})
```

Correct:

```typescript
buildDepositConduitCall({
  conduit: '0x...', token: '0x...', amount: 1000000n, sender: '0xYourAddress',
  vehicle: '0x...', salt: randomSalt(),
})
```

The deposit and redeem builders take `sender` because the query salt is derived from `msg.sender`:
`query.salt` must equal `keccak256(abi.encode(msg.sender, salt))`, so the call cannot be encoded
without knowing who will send it, and any other account sending it reverts with `InvalidQuerySalt`.

`sender` is the transaction's sender, not the position's owner. Through a Safe, an EIP-5792 batch or
a relayer it is that contract's address. `receiver` is what defaults to `sender`, and it is the one
to override when the shares should land elsewhere.

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

Do NOT derive `minOutput` from it. The floor in `query.output.value` is enforced at the VEHICLE's
output and ignores conduit fees, so a value taken from the conduit's estimate sits below the number
it is compared against and never fires. Use `estimateVehicle` with `applySlippage`. For the same
reason the floor does not bound the conduit shares the user receives — never show it as a minimum
received.

Source: Protocol docs — estimate() vs convert()

### HIGH Not handling async conduit queries

Wrong:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({ conduit, token, amount: 1000000n, sender, vehicle, salt: randomSalt() }), account: account })).request,
)
// Assumes deposit is settled immediately
```

Correct:

```typescript
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildDepositConduitCall({ conduit, token, amount: 1000000n, sender, vehicle, salt: randomSalt() }), account: account })).request,
)
// For async vehicles (Ethena, Syrup): deposit enters PROCESSING state.
// Monitor vehicle Updated events or poll vehicle.state(query).
// When state reaches UNLOCKING, call:
writeContract(
  client,
  (await simulateContract(client, { ...buildProcessConduitQueryCall({ conduit, query, account }), account: account.address })).request,
)
```

When the underlying vehicle is async, the deposit/redeem creates a query in PROCESSING state. Settlement requires calling `buildProcessConduitQueryCall` after the vehicle reaches UNLOCKING.

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

### HIGH Expecting the SDK to approve

Nothing in the SDK sends an ERC-20 approval. A deposit reverts without one, and the allowance is
spent by the deposit, so a later deposit of the same size needs a new one — read the allowance
before each attempt. Send the approval yourself, or batch it with the deposit through `toCall` and
`sendCalls`, checking the wallet's capabilities before relying on the two landing atomically.

Source: src/actions/conduit/depositConduit.ts

See also: railnet-core/SKILL.md § Common Mistakes

## References

- [Error Reference](references/error-reference.md)

See also: railnet-access-control/SKILL.md — spawning a conduit requires an EAC address, and conduit operations may fail with `MissingRole` if `VEHICLE_STEAM_DEPOSIT` or `VEHICLE_STEAM_REDEEM` is not granted.

See also: railnet-react/SKILL.md — React hooks wrap these core actions.
