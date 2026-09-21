---
name: railnet-conduit
description: >
  Interact with Railnet Conduits and the modules a conduit is assembled from —
  depositConduit, redeemConduit, getConduitPosition, getConduitInfo,
  estimateConduit, predictConduitDeployment, buildSpawnConduitCall,
  buildFinalizeConduitDepositCall, buildProcessConduitQueryCall,
  buildForceRedeemCall, getIsTransferable, buildEnableConduitTransfersCall,
  plus the FeeManager, AccountList, OwnerRegistry and interception modules that
  spawnConduit takes as parameters (buildSpawnFeeManagerCall, buildSetFeesCall,
  buildSpawnAccountListCall, getAccountListStatus, buildSpawnOwnerRegistryCall,
  buildWrapQueryCall, buildSetConduitInterceptionsCall). Covers deposits,
  redemptions, position reads, estimates, the async query lifecycle, compliance
  screening, fee configuration, share transfers and conduit deployment. Load
  when working with conduit operations or configuring a conduit's modules.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.8.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/conduit/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/feeManager/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/accountList/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/ownerRegistry/*.ts'
  - 'railnetorg/railnet-sdk:src/actions/interceptions/*.ts'
---

# Railnet Conduit Operations

## Setup

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const publicClient = createPublicClient({ chain: mainnet, transport: http() })

// The wallet client signs. The public client above simulates and reads.
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const walletClient = createWalletClient({ account, chain: mainnet, transport: http() })
```

## Core Patterns

### Reading Conduit State

```typescript
import { getConduitInfo, getConduitPosition } from '@railnetorg/railnet-sdk'

const info = await getConduitInfo(publicClient, { conduit })
const position = await getConduitPosition(publicClient, { conduit, account: user })

// info: conduit, asset, name, symbol, decimals, totalSupply, totalAssets, holdings, isEnabled
// position: shares, assets
```

### Assembling a conduit's modules

`buildSpawnConduitCall` takes four module addresses and an optional interception list. Each is an
address, so spawn the module first or pass one already deployed.

| Parameter | Module | What it decides |
| --- | --- | --- |
| `accessControl` | ExternalAccessControl | Who may call every gated function |
| `feeManager` | FeeManager | Fee rates, and who the collected fees are paid to |
| `accountList` | AccountList | Who may deposit, receive and transfer |
| `ownerRegistry` | OwnerRegistry | Who owns each live query, and whether it can be wrapped |
| `initialInterceptions` | inline on the conduit | Where a share of each asset is diverted |

```typescript
import {
  buildSpawnAccountListCall, buildSpawnFeeManagerCall, buildSpawnOwnerRegistryCall,
  AllowlistMode, randomSalt,
} from '@railnetorg/railnet-sdk'

// Fees: every rate is capped forever by the matching initialMaxFees set here.
const feeManagerCall = buildSpawnFeeManagerCall({
  factory: addresses.feeManagerFactory,
  accessControl,
  initialFees: { performanceFeeBps: 1000, managementFeeBps: 50, depositFeeBps: 0, redeemFeeBps: 0 },
  initialMaxFees: { performanceFeeBps: 2000, managementFeeBps: 200, depositFeeBps: 100, redeemFeeBps: 100 },
  initialRecipients: [{ target: treasury, shareBps: 10000 }], // sorted ascending, totals 10000
  deploymentSalt: randomSalt(),
})

// Compliance: OPEN ignores the allow-list, REGULAR gates deposits, STRICT gates transfers too.
const accountListCall = buildSpawnAccountListCall({
  factory: addresses.accountListFactory,
  accessControl,
  mode: AllowlistMode.REGULAR,
  initialAllowList: [],
  initialBlockList: [],
  sanctionsEnabled: false,
  oracle: zeroAddress, // a non-zero oracle is required before sanctionsEnabled can be true
  deploymentSalt: randomSalt(),
})

const ownerRegistryCall = buildSpawnOwnerRegistryCall({
  factory: addresses.ownerRegistryFactory,
  name: 'My Conduit Queries',
  symbol: 'MYCQ',
  deploymentSalt: randomSalt(),
})
```

Each factory exposes a matching `predict…Deployment(client, parameters)` that returns the CREATE2
address for those exact parameters, so the three module addresses are known before any of them is
sent. None of these three pulls tokens from the caller; only the ConduitFactory does.

Full parameter and revert tables: [Module Reference](references/modules.md).

### Spawning a Conduit

A conduit is enabled by the ConduitFactory, never by you. `conduit.enable()` accepts only the
factory, which calls it once the seed deposit settles and `initialExpectedSupply` is reached. On a
synchronous vehicle that happens inline in `spawn()`. On an async one the factory records a pending
deposit and emits `PendingConduitDeposit`; send `buildFinalizeConduitDepositCall` once the vehicle's
query settles, and the same path enables the conduit.

`buildEnableConduitCall` is deprecated and removed in 0.9.0: it builds `conduit.enable()`, which
reverts `InvalidCaller` for anyone but the factory. To let holders move their shares, the call is
`buildEnableConduitTransfersCall`.

```typescript
import {
  buildFinalizeConduitDepositCall, buildSpawnConduitCall, extractConduitAddress,
  getConduitInfo, getInitialDepositAmount,
} from '@railnetorg/railnet-sdk'
import { erc20Abi } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'

const params = {
  factory: addresses.conduitFactory,
  name: 'My Conduit',
  symbol: 'MYC',
  vehicle,
  feeManager, accountList, ownerRegistry, accessControl,
  transferEnabled: false,
  initialExpectedSupply: 1_000_000n,
  account: account.address,
  // initialInterceptions optional — Array<{ asset, recipients: Array<{ target, shareBps: bigint, chainId: bigint }> }>
}

// The factory pulls a seed deposit sized by the AssetRegistry. Approve that exact amount.
const initialDepositAmount = await getInitialDepositAmount(publicClient, {
  assetRegistry: addresses.assetRegistry,
  asset: vehicleAsset,
})
await writeContract(walletClient, {
  address: vehicleAsset, abi: erc20Abi, functionName: 'approve',
  args: [params.factory, initialDepositAmount], account: account.address,
})

const hash = await writeContract(
  walletClient,
  (await simulateContract(publicClient, { ...buildSpawnConduitCall(params), account: account.address })).request,
)
const receipt = await publicClient.waitForTransactionReceipt({ hash })

const conduit = extractConduitAddress(receipt, params.factory)
if (!conduit) throw new Error('no conduit in the logs')

// Synchronous vehicle: already enabled. Async: finalize once the seed deposit settles.
const { isEnabled } = await getConduitInfo(publicClient, { conduit })
if (!isEnabled) {
  await writeContract(
    walletClient,
    (await simulateContract(publicClient, {
      ...buildFinalizeConduitDepositCall({ factory: params.factory, conduit }),
      account: account.address,
    })).request,
  )
}
```

`finalizeConduitDeposit` is sent to the **factory**, not the conduit. It burns the initial shares
and opens the conduit to the public.

Source: src/actions/conduit/spawnConduit.ts, src/actions/conduit/finalizeConduitDeposit.ts

### Depositing and Redeeming

A deposit is two transactions. The conduit pulls the token, so it must be approved first, and the
allowance is spent by the deposit — a later deposit of the same size needs a new approval. The SDK
does not approve for you.

```typescript
import { conduitAbi, buildDepositConduitCall, buildRedeemConduitCall, randomSalt } from '@railnetorg/railnet-sdk'
import { erc20Abi } from 'viem'
import { readContract, simulateContract, waitForTransactionReceipt, writeContract } from 'viem/actions'

// 1. approve — a plain ERC-20 call, nothing Railnet-specific
const approveHash = await writeContract(walletClient, {
  address: usdcAddress, abi: erc20Abi, functionName: 'approve',
  args: [conduitAddress, 1_000_000n], account: account.address,
})
await waitForTransactionReceipt(publicClient, { hash: approveHash })

// 2. deposit — calls conduit.create() with a DEPOSIT query
const vehicle = await readContract(publicClient, {
  address: conduitAddress, abi: conduitAbi, functionName: 'getVehicle',
})

const depositHash = await writeContract(
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
      // minOutput optional — a floor in VEHICLE shares, from estimateVehicle + applySlippage
    }),
    account: account.address,
  })).request,
)

// Redeem: no approval, the conduit burns the caller's shares.
const asset = await readContract(publicClient, {
  address: conduitAddress, abi: conduitAbi, functionName: 'asset',
})

const redeemHash = await writeContract(
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
  conduit: conduitAddress, token: usdcAddress, amount: 1_000_000n,
  sender: account.address, salt: randomSalt(),
})
```

`queryId` is `keccak256(abi.encode(chainId, vehicle, query))`, the value the conduit emits in
`QueryCreated` and the key an indexer holds. It is known **before** the transaction is sent, because
a deposit's query is built off chain.

A redeem's is not: the conduit assembles that query at the share ratio of the including block, so
`getRedeemConduitCall` returns `querySalt` (`keccak256(abi.encode(sender, salt))`, a field of the
created query) and `extractQueryIds(receipt, conduit)` reads the id back from the receipt.

Keep the salt for as long as the operation lasts. A retry with a fresh salt is not a retry, it is a
second query with a different id.

### Call Builders

`buildDepositConduitCall`, `buildRedeemConduitCall`, `buildSpawnConduitCall`,
`buildEnableConduitTransfersCall`, `buildFinalizeConduitDepositCall`, `buildForceRedeemCall`,
`buildSetConduitInterceptionsCall` and `buildProcessConduitQueryCall` return the viem contract call
without sending it — synchronous, no client. Use them to batch, simulate, or sign elsewhere.

A builder takes what it cannot read for itself. `buildDepositConduitCall` requires `vehicle` and
`salt`, which `depositConduit` reads from the conduit and defaults; `buildRedeemConduitCall`
requires `outputAsset` and `salt`, which `redeemConduit` fills from `conduit.asset()` and
`randomSalt()`. A prepared deposit also skips the ERC-20 approval that `depositConduit` sends for
you, so approve separately before submitting.

### Handling Async Queries (Ethena/Syrup)

When the underlying vehicle is async, `create()` returns state PROCESSING, not UNLOCKING. The query
must be processed later, once the vehicle settles.

`create()` never produces REJECTED or RECOVERING — validation failures always revert. If `create()`
succeeds, the query is in PROCESSING or UNLOCKING.

Processing needs the exact struct the conduit created. Do not hand-roll it: keep the original call
parameters and rebuild it with `buildDepositConduitQuery`, which is the same struct
`buildDepositConduitCall` encoded.

```typescript
import {
  buildDepositConduitQuery, buildProcessConduitQueryCall, toQueryId, toQuerySalt,
} from '@railnetorg/railnet-sdk'

const query = buildDepositConduitQuery({
  conduit: conduitAddress, token: usdcAddress, amount: depositAmount,
  sender: account.address, vehicle, salt: originalSalt,
})

// query.salt is not the salt passed in. toQuerySalt derives it: keccak256(abi.encode(sender, salt)).
// toQueryId gives the id QueryCreated carries, for joining against an indexer.
const querySalt = toQuerySalt({ sender: account.address, salt: originalSalt })
const queryId = toQueryId({ chainId: mainnet.id, vehicle, query })

// Send once the vehicle reaches UNLOCKING
await writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildProcessConduitQueryCall({ conduit: conduitAddress, query, account: account.address }),
    account: account.address,
  })).request,
)
```

A redeem's query has no off-chain equivalent: the conduit assembles it at the share ratio of the
including block. Recover it from the receipt with `extractQueryIds`, or join on `querySalt`.

Source: src/actions/conduit/processConduitQuery.ts, src/actions/conduit/queryId.ts

### Transfers, screening and forced exit

Share transfers are off until `buildEnableConduitTransfersCall` turns them on. That is a one-way
latch: no call turns them back off, and re-sending it reverts `StateUnchanged`. It needs
CONDUIT_SET_TRANSFER_ENABLED.

Once transfers are on, each one is still screened by the AccountList. `getIsTransferable` answers
both questions in one read, so check it before offering a transfer in a UI.

```typescript
import { buildForceRedeemCall, getAccountListStatus, getIsTransferable } from '@railnetorg/railnet-sdk'

if (!(await getIsTransferable(publicClient, { conduit, from, to }))) return refuse()

// Why a party failed: canDeposit, canRedeem, canReceive, isAllowListed, isBlocked, isSanctioned, mode
const status = await getAccountListStatus(publicClient, { accountList, account: to })

// Ejecting a holder. Only works on a sanctioned or block-listed user, and needs CONDUIT_FORCE_REDEEM.
const call = buildForceRedeemCall({
  conduit, user: sanctionedHolder, amount: shares,
  outputAsset: { asset, value: 0n },
})
```

`forceRedeem` burns the shares and opens a redeem query paid to the holder. Against an async vehicle
that query is PROCESSING, so the shares are gone before the payout lands. Settle it with
`buildProcessConduitQueryCall` like any other query.

Source: src/actions/conduit/forceRedeem.ts, src/actions/conduit/getIsTransferable.ts

### Wrapping a query claim

The OwnerRegistry records who owns each live query. `buildWrapQueryCall` mints an ERC-721 over one,
which makes a pending position transferable before it settles.

```typescript
import { buildWrapQueryCall, getQueryClaim } from '@railnetorg/railnet-sdk'

const claim = await getQueryClaim(publicClient, { ownerRegistry, conduit, queryId })
// A zero owner reads two ways: with isWrapped true the NFT holder owns the claim,
// with it false the registry never knew this query.

const call = buildWrapQueryCall({ ownerRegistry, query, conduit })
```

Wrapping reverts `NonWrappableState` on EMPTY, SETTLED or REJECTED, so it only applies to a query
still in flight. It also reverts `UnauthorizedWrap` unless the caller is the registered owner, and
`TransferNotAllowed` when the conduit would refuse that caller a transfer to itself.

Source: src/actions/ownerRegistry/wrapQuery.ts

## Common Mistakes

### CRITICAL Reads and simulations do not belong on the wallet client

Wrong:

```typescript
const { request } = await simulateContract(walletClient, { ...buildDepositConduitCall({ /* … */ }), account })
```

Correct:

```typescript
const { request } = await simulateContract(publicClient, { ...buildDepositConduitCall({ /* … */ }), account })
await writeContract(walletClient, request)
```

A wallet client's transport is the wallet itself, so it answers reads from whatever node it picked,
at whatever freshness it keeps. One was observed pinned to a block from before the approval was
sent, which made the deposit simulate against a spent allowance and revert on state already on
chain. Simulate on the public client, then send the request with the wallet. Only signing needs the
wallet.

A script with a single client uses it for both, which is fine: it chose that client's transport.

Source: src/actions/conduit/getDepositConduitCall.ts

### CRITICAL Forgetting the sender parameter on a deposit or redeem

The deposit and redeem builders take `sender` because the query salt is derived from `msg.sender`:
`query.salt` must equal `keccak256(abi.encode(msg.sender, salt))`, so the call cannot be encoded
without knowing who will send it, and any other account sending it reverts with `InvalidQuerySalt`.

`sender` is the transaction's sender, not the position's owner. Through a Safe, an EIP-5792 batch or
a relayer it is that contract's address. `receiver` is what defaults to `sender`, and it is the one
to override when the shares should land elsewhere.

Source: src/actions/conduit/depositConduit.ts:29

### CRITICAL Assuming a blocked holder cannot redeem, or a sanctioned one can

Precedence across every predicate is sanctions, then block-list, then the allow-list. Redeem is
gated by sanctions alone, so a blocked holder can always exit, and that is deliberate — blocking is
what makes a holder eligible for `forceRedeem`, not what traps them.

Screening fails closed. An oracle that reverts, or returns anything other than 32 bytes, marks the
account sanctioned; an EOA set as the oracle returns nothing and so sanctions everyone. A sanctioned
account cannot redeem at all. Read `getAccountListStatus` rather than inferring a verdict from the
lists.

Source: src/actions/accountList/getAccountListStatus.ts, src/actions/accountList/types.ts

### HIGH Using estimate for share valuation instead of position

`estimateConduit` includes fees. For fee-free share-to-asset conversion use `getConduitPosition`,
which calls `convert()` internally.

Do NOT derive `minOutput` from it. The floor in `query.output.value` is compared against the
VEHICLE's own estimate, in vehicle shares. `Conduit._estimate` delegates to the vehicle, then
converts the result through the conduit's share rate and deducts conduit fees, so what it returns is
in conduit shares, a different denomination. A floor taken from it is looser or tighter than the one
you asked for depending on the share rate, and at some rates every deposit reverts. Use
`estimateVehicle` with `applySlippage`. The floor never bounds the conduit shares the user receives
either, so never show it as a minimum received.

Source: Protocol docs — estimate() vs convert()

### HIGH Not handling async conduit queries

Against an async vehicle a deposit or redeem creates a query in PROCESSING, not a settled position.
Monitor the vehicle's `Updated` events or poll `vehicle.state(query)`, and send
`buildProcessConduitQueryCall` once it reaches UNLOCKING. Treating the deposit receipt as settlement
reports a balance the holder does not have yet.

Source: src/actions/conduit/processConduitQuery.ts

### HIGH Giving fee recipients and interceptions the same total

They look alike and validate differently. A fee recipient split must be non-empty, sorted strictly
ascending by `target`, and total **exactly** 10000 bps, or the FeeManager reverts
`RecipientsNotStrictlyAscending` or `InvalidBpsValue`. An interception's recipients may total **at
most** 10000 bps, and a shortfall is legal: the remainder simply stays undistributed.

`buildSetFeeRecipientsCall` replaces the whole split, and `buildSetConduitInterceptionsCall` replaces
the whole rule list. Neither merges with what is stored, so an empty interception array clears every
rule.

Source: src/actions/feeManager/types.ts, src/actions/interceptions/setInterceptions.ts

### HIGH Expecting the SDK to approve

Nothing in the SDK sends an ERC-20 approval. A deposit reverts without one, and the allowance is
spent by the deposit, so a later deposit of the same size needs a new one — read the allowance
before each attempt. Send the approval yourself, or batch it with the deposit through `toCall` and
`sendCalls`, checking the wallet's capabilities before relying on the two landing atomically.

Source: src/actions/conduit/depositConduit.ts

See also: railnet-core/SKILL.md § Common Mistakes

## References

- [Module Reference](references/modules.md) — FeeManager, AccountList, OwnerRegistry, interceptions
- [Error Reference](references/error-reference.md)

See also: railnet-access-control/SKILL.md — every module above is gated by an ExternalAccessControl,
and conduit operations fail with `MissingRole` if `VEHICLE_STEAM_DEPOSIT` or `VEHICLE_STEAM_REDEEM`
is not granted.

See also: railnet-vehicle/SKILL.md — `buildSetVehicleInterceptionsCall` is the vehicle-side
counterpart of the conduit call documented here.

See also: railnet-react/SKILL.md — React hooks wrap these core actions.
