---
name: railnet-react
description: >
  React hooks and TanStack Query integration for railnet-sdk —
  useConduitPosition, useConduitInfo, useEstimateConduit,
  usePredictConduitDeployment, useDepositConduitCall,
  useRedeemConduitCall, conduitPositionQueryOptions,
  conduitInfoQueryOptions, estimateConduitQueryOptions,
  predictConduitDeploymentQueryOptions,
  depositConduitCallQueryOptions, redeemConduitCallQueryOptions,
  query key pattern, and sending a built call with wagmi's own
  useSimulateContract / useWriteContract. The SDK ships no write
  hooks. Requires wagmi + @tanstack/react-query. Load when
  building React UIs for Railnet.
metadata:
  type: framework
  library: railnet-sdk
  framework: react
  library_version: '0.3.1'
requires:
  - railnet-core
sources:
  - 'railnetorg/railnet-sdk:src/react/hooks/*.ts'
  - 'railnetorg/railnet-sdk:src/react/query/*.ts'
---

This skill builds on railnet-core. Read it first for foundational concepts.

## Setup

`@railnetorg/railnet-sdk/react` requires `wagmi` and `@tanstack/react-query`. Ensure your application is wrapped in both `WagmiProvider` and `QueryClientProvider`. The SDK ships production addresses for Ethereum (`1`); Base runs a staging deployment, exported from `@railnetorg/railnet-sdk/staging`.

```tsx
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Available Hooks

Every hook here is a read. **The SDK ships no write hooks**: a write is a call you build, and you
send it with wagmi's own `useSimulateContract` and `useWriteContract`. That is wagmi's documented
path, and it keeps the preflight on the transport the app configured rather than on the wallet's,
which answers reads from whatever node it picked at whatever freshness it keeps.

### Query hooks (return a TanStack Query result)

| Hook | Parameters | Returns |
|------|-----------|---------|
| `useConduitPosition` | `{ conduit, account, blockNumber?, chainId?, enabled? }` | `ConduitPosition` (shares, assets, blockNumber) |
| `useConduitInfo` | `{ conduit, chainId?, enabled? }` | `ConduitInfo` (name, symbol, totalSupply, totalAssets, holdings, decimals, isEnabled) |
| `useEstimateConduit` | `{ conduit, asset, mode, estimationType, chainId?, enabled? }` | `Asset` |
| `usePredictConduitDeployment` | `{ factory, ..., querySalt, deploymentSalt, chainId?, enabled? }` | `Address` |
| `useDepositConduitCall` | `{ conduit, token, amount, sender, salt, vehicle?, minOutput?, receiver?, chainId?, enabled? }` | `{ call, query, queryId, vehicle }` |
| `useRedeemConduitCall` | `{ conduit, shares, sender, salt, outputAsset?, receiver?, chainId?, enabled? }` | `{ call, querySalt, outputAsset }` |

### Sending a call

```tsx
import { buildEnableConduitTransfersCall } from '@railnetorg/railnet-sdk'
import { useSimulateContract, useWriteContract } from 'wagmi'

const { data: simulation, error } = useSimulateContract(buildEnableConduitTransfersCall({ conduit }))
const { writeContract, isPending } = useWriteContract()

<button onClick={() => simulation && writeContract(simulation.request)} disabled={!simulation}>
  Enable
</button>
```

From an event handler, where the arguments only exist inside the handler, use `@wagmi/core`'s
`simulateContract(config, ...)` with `useConfig()` instead of the declarative hook.

Every `build*Call` builder is listed in railnet-core. `useDepositConduitCall` and
`useRedeemConduitCall` exist because those two calls need an address read from chain first — the
conduit's vehicle, and its underlying asset.

### `sender`, not `account`

The deposit and redeem builders take `sender`: the address that will send the transaction.
`conduit.create()` requires `query.salt == keccak256(abi.encode(msg.sender, salt))`, so a call built
for one address reverts with `InvalidQuerySalt` when another sends it. Through a Safe, an EIP-5792
batch or a relayer, that is the smart account's address — not `useAccount().address`.

### Salts are the operation's identity

No hook and no builder generates a salt. Create one when the user starts the operation and hold it
across simulation, signature and retry:

```tsx
const [salt] = useState(() => randomSalt())
```

`useDepositConduitCall` returns `queryId` — `keccak256(abi.encode(chainId, vehicle, query))`, the
value the conduit emits in `QueryCreated`. It is known before the transaction is sent, so it is the
key to join the transaction to an indexed query. A redeem's query is assembled on chain at the
share ratio of the including block, so `useRedeemConduitCall` returns `querySalt` instead; read the
id back from the receipt with `extractQueryIds`.

### Deposits: approve first

A deposit needs an ERC-20 approval, and the allowance is spent by the deposit. Send it with wagmi's
`useWriteContract` and `erc20Abi`, or batch it with the deposit through `toCall` and
`useSendCalls` — checking the wallet's capabilities before relying on atomicity.

Set `minOutput` from `estimateVehicle` and `applySlippage`, not from `useEstimateConduit`. The floor
is compared against the vehicle's own estimate, in vehicle shares; the conduit's estimate is in
conduit shares, converted through the share rate and net of conduit fees. Different denominations —
so a floor taken from it silently widens the tolerance or reverts good deposits, depending on the
rate. It does not bound the conduit shares received either, so never label it a minimum received.

### Multi-vehicle deployment, and async queries

Deploying a multi-vehicle has no hook and no single function: it is eight or more transactions
against several factories, each needing an address the previous one returned. Send the sequence from
a script or a server — see the `deployingAMultiVehicle` guide — and drive the UI from the read hooks
once it lands.

Advancing an async (STEAM) query is `buildProcessConduitQueryCall` and
`buildFinalizeConduitDepositCall`. In a deployment where a keeper drives settlement, those are its
calls, not an integration's: a UI follows a query by its id.

## Query Options (for custom query composition)

| Function | Query Key Pattern |
|----------|-------------------|
| `conduitPositionQueryOptions(client, { conduit, account })` | `['railnet', 'conduitPosition', { chainId, conduit, account }]` |
| `conduitInfoQueryOptions(client, { conduit })` | `['railnet', 'conduitInfo', { chainId, conduit }]` |
| `estimateConduitQueryOptions(client, { conduit, assets, mode, estimationType })` | `['railnet', 'estimateConduit', { chainId, ... }]` |
| `predictConduitDeploymentQueryOptions(client, params)` | `['railnet', 'predictConduitDeployment', { chainId, ... }]` |
| `depositConduitCallQueryOptions(client, params)` | `['railnet', 'depositConduitCall', { chainId, ... }]` |
| `redeemConduitCallQueryOptions(client, params)` | `['railnet', 'redeemConduitCall', { chainId, ... }]` |

The `chainId` is taken from the client the options were built with, so a key cannot name a chain
other than the one it read from. Key values are normalised for hashing: a `bigint` becomes a
string, an address is lowercased.

Every read hook returns its `queryKey` alongside the query result, so invalidating what a
component displays needs no builder and no knowledge of the resolved chain:

```ts
const { data, queryKey } = useConduitPosition({ conduit, account })
queryClient.invalidateQueries({ queryKey })
```

Use a builder when the hook is not mounted where you invalidate. They take the chain first: `conduitPositionQueryKey(chainId, parameters)`, and the
same for `conduitInfoQueryKey`, `estimateConduitQueryKey`, `predictConduitDeploymentQueryKey`,
`depositConduitCallQueryKey` and `redeemConduitCallQueryKey`.

Each family also exports its prefix — `conduitPositionQueryPrefix`, `conduitInfoQueryPrefix`,
`estimateConduitQueryPrefix`, `predictConduitDeploymentQueryPrefix`,
`depositConduitCallQueryPrefix`, `redeemConduitCallQueryPrefix` — to invalidate a family
across every chain without reconstructing a key.

A missing client or account makes the options resolve to `skipToken`, so `*QueryOptions` can be
handed to `prefetchQuery` or a route loader directly, not only to a hook behind `enabled`.

## Hooks and Components

### Reading Conduit Data

Use `useConduitPosition` to fetch user shares and assets. It returns a standard TanStack Query result.

```tsx
import { useConduitPosition } from '@railnetorg/railnet-sdk/react'
import { formatUnits } from 'viem'
import type { Address } from 'viem'

export function ConduitBalance({ conduit, account }: { conduit: Address, account: Address }) {
  const { data, isLoading, error } = useConduitPosition({ conduit, account })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>Shares: {data?.shares.toString()}</p>
      <p>Assets: {formatUnits(data?.assets ?? 0n, 18)}</p>
    </div>
  )
}
```

### Executing Transactions

A write is two steps you own: resolve the call, then send it with wagmi. The deposit below approves
first, because the SDK never approves on your behalf.

```tsx
import { randomSalt } from '@railnetorg/railnet-sdk'
import { useDepositConduitCall } from '@railnetorg/railnet-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { Address } from 'viem'
import { erc20Abi } from 'viem'
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

export function DepositForm({
  conduit,
  token,
  amount,
}: { conduit: Address; token: Address; amount: bigint }) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const queryClient = useQueryClient()
  // one salt for the whole operation: a new one is a different query
  const [salt] = useState(() => randomSalt())

  const { data: allowance, queryKey: allowanceKey } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, conduit] : undefined,
    query: { enabled: Boolean(address) },
  })

  const { data: deposit } = useDepositConduitCall({
    conduit,
    token,
    amount,
    sender: address,
    salt,
  })

  const approved = (allowance ?? 0n) >= amount
  const { data: simulation } = useSimulateContract({
    ...deposit?.call,
    query: { enabled: Boolean(deposit) && approved },
  })

  const { writeContractAsync, isPending } = useWriteContract()

  async function handleDeposit() {
    if (!address || !publicClient) return

    if (!approved) {
      const approveHash = await writeContractAsync({
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [conduit, amount],
      })
      await publicClient.waitForTransactionReceipt({ hash: approveHash })
      await queryClient.invalidateQueries({ queryKey: allowanceKey })
      return
    }

    if (!simulation) return
    await writeContractAsync(simulation.request)
    // deposit.queryId is the key to follow this operation from here on
  }

  return (
    <button onClick={handleDeposit} disabled={!address || isPending}>
      {approved ? 'Deposit' : 'Approve'}
    </button>
  )
}
```

### Custom Query Composition

Use `queryOptions` to customize caching behavior or compose multiple queries.

```tsx
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { conduitInfoQueryOptions } from '@railnetorg/railnet-sdk/react'
import type { Address } from 'viem'

export function useLongLivedConduitInfo(conduit: Address) {
  const publicClient = usePublicClient()
  
  return useQuery({
    ...conduitInfoQueryOptions(publicClient!, { conduit }),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
```

### Invalidating Queries

Every read hook hands back its own `queryKey`, so refreshing what a component displays needs no key
builder and no knowledge of the resolved chain.

```tsx
import { useConduitPosition } from '@railnetorg/railnet-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

const queryClient = useQueryClient()
const publicClient = usePublicClient()
const { queryKey } = useConduitPosition({ conduit, account: address })

const receipt = await publicClient.waitForTransactionReceipt({ hash })
await queryClient.invalidateQueries({ queryKey })
```

Do not hand-write `['railnet', 'conduitPosition', { conduit, account }]`: the key also carries the
chain and normalises its values, so a hand-built one silently fails to match.

## Common Mistakes

1. **Missing Providers**: Using `useConduitPosition` or other hooks outside of `WagmiProvider` and `QueryClientProvider`. This causes `usePublicClient()` to return `undefined`, leading to immediate runtime crashes when the hook attempts to initialize the query.

2. **Looking for a write hook**: there are none. `useDepositConduit`, `useRedeemConduit`, `useSpawnConduit` and the rest were removed — build the call and send it with wagmi's `useSimulateContract` and `useWriteContract`.

3. **Passing the connected account as `sender`, blindly**: `sender` is whoever will send the transaction. Through a Safe or an EIP-5792 batch that is the smart account, and a call built for the user's EOA reverts with `InvalidQuerySalt`.

4. **Regenerating the salt**: calling `randomSalt()` in the render body makes a new query on every render, and the `queryId` you showed the user stops matching what gets sent. Hold it in state.

5. **Deriving `minOutput` from `useEstimateConduit`**: the floor is compared against the vehicle's estimate, in vehicle shares, while the conduit's estimate is in conduit shares. Different denominations, so the floor ends up looser or tighter than asked for depending on the share rate. Use `estimateVehicle` with `applySlippage`.

6. **Wrong Chain Configuration**: Configuring `wagmi` for a different chain than the one the conduit lives on. Each chain has its own protocol deployment, so hooks will silently return stale data, zero balances, or fail to find contract addresses because the underlying `publicClient` is pointing to the wrong network.

7. **BigInt Serialization in DevTools**: Passing `bigint` values in query parameters (like `amount` in some estimations). While TanStack Query handles `bigint` in query keys for equality checks, the standard JSON-based DevTools might fail to serialize them, leading to confusing "cannot serialize BigInt" errors in the console during development.

---
See also: railnet-conduit/SKILL.md — hooks wrap these core actions
See also: railnet-core/SKILL.md — chain and client setup
