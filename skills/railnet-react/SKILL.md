---
name: railnet-react
description: >
  React hooks and TanStack Query integration for railnet-sdk —
  useConduitPosition, useConduitInfo, useEstimateConduit,
  usePredictConduitDeployment, useDepositConduit, useRedeemConduit,
  useSpawnConduit, useEnableConduit, useFinalizeConduitDeposit,
  useProcessConduitQuery, useDeployMultiVehicle, useSpawnMultiVehicle,
  useSpawnAaveV3Vehicle, useAuthorizeVehicle, useSetQueues,
  useGrantScopedRole, useRevokeScopedRole, useSetScopedRolePublic,
  useSpawnAccessControl, conduitPositionQueryOptions,
  conduitInfoQueryOptions, estimateConduitQueryOptions,
  predictConduitDeploymentQueryOptions, query key pattern.
  Requires wagmi + @tanstack/react-query. Load when building
  React UIs for Railnet.
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

`@railnetorg/railnet-sdk/react` requires `wagmi` and `@tanstack/react-query`. Ensure your application is wrapped in both `WagmiProvider` and `QueryClientProvider`. The SDK ships addresses for Ethereum (`1`) and Base (`8453`).

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

### Query Hooks (read-only, return TanStack Query result)

| Hook | Parameters | Returns |
|------|-----------|---------|
| `useConduitPosition` | `{ conduit, account, enabled? }` | `ConduitPosition` (shares, assets) |
| `useConduitInfo` | `{ conduit, enabled? }` | `ConduitInfo` (name, symbol, totalSupply, totalAssets, holdings, decimals) |
| `useEstimateConduit` | `{ conduit, asset, mode, estimationType, enabled? }` | `Asset` |
| `usePredictConduitDeployment` | `{ factory, ..., querySalt, deploymentSalt, enabled? }` | `Address` |

### Mutation Hooks (write, return TanStack Mutation result)

| Hook | Mutate Parameters | Returns |
|------|------------------|---------|
| `useDepositConduit` | `{ conduit, token, amount, account, receiver?, salt? }` | `Hash` |
| `useRedeemConduit` | `{ conduit, shares, account, receiver?, outputAsset?, salt? }` | `Hash` |
| `useSpawnConduit` | `SpawnConduitParameters & { account }` | `Hash` |
| `useEnableConduit` | `{ conduit, account }` | `Hash` |
| `useFinalizeConduitDeposit` | `{ factory, conduit, account }` | `Hash` |
| `useProcessConduitQuery` | `{ conduit, query, account }` | `Hash` |
| `useSpawnAaveV3Vehicle` | `SpawnAaveV3VehicleParameters & { account }` | `Hash` |
| `useSpawnMultiVehicle` | `SpawnMultiVehicleParameters & { account }` | `Hash` |
| `useAuthorizeVehicle` | `{ vehicleManager, vehicle, account }` | `Hash` |
| `useSetQueues` | `{ queueStrategyEngine, depositQueue, redeemQueue, account }` | `Hash` |
| `useDeployMultiVehicle` | `DeployMultiVehicleParameters & { account }` | `DeployMultiVehicleResult` |
| `useGrantScopedRole` | `{ accessControl, role, scope, grantee, account }` | `Hash` |
| `useRevokeScopedRole` | `{ accessControl, role, scope, grantee, account }` | `Hash` |
| `useSetScopedRolePublic` | `{ accessControl, role, scope, isPublic, account }` | `Hash` |
| `useSpawnAccessControl` | `SpawnAccessControlParameters & { account }` | `Hash` |

All mutation hooks internally use `useWalletClient()` from wagmi and pass the wallet client to the underlying SDK action.

## Query Options (for custom query composition)

| Function | Query Key Pattern |
|----------|-------------------|
| `conduitPositionQueryOptions(client, { conduit, account })` | `['railnet', 'conduitPosition', { chainId, conduit, account }]` |
| `conduitInfoQueryOptions(client, { conduit })` | `['railnet', 'conduitInfo', { chainId, conduit }]` |
| `estimateConduitQueryOptions(client, { conduit, assets, mode, estimationType })` | `['railnet', 'estimateConduit', { chainId, ... }]` |
| `predictConduitDeploymentQueryOptions(client, params)` | `['railnet', 'predictConduitDeployment', { chainId, ... }]` |

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
same for `conduitInfoQueryKey`, `estimateConduitQueryKey`, `predictConduitDeploymentQueryKey`.

Each family also exports its prefix — `conduitPositionQueryPrefix`, `conduitInfoQueryPrefix`,
`estimateConduitQueryPrefix`, `predictConduitDeploymentQueryPrefix` — to invalidate a family
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

Write hooks like `useDepositConduit` return TanStack Mutation objects. You must explicitly provide the `account` from wagmi's `useAccount`.

```tsx
import { useDepositConduit } from '@railnetorg/railnet-sdk/react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import type { Address } from 'viem'

export function DepositForm({ conduit, token }: { conduit: Address, token: Address }) {
  const { address } = useAccount()
  const { mutate, isPending } = useDepositConduit()

  const handleDeposit = () => {
    if (!address) return
    
    mutate({
      conduit,
      token,
      amount: parseUnits('100', 18),
      account: address, // Required: account must be explicitly passed
    })
  }

  return (
    <button onClick={handleDeposit} disabled={isPending || !address}>
      {isPending ? 'Depositing...' : 'Deposit 100 Tokens'}
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

After a successful mutation, invalidate relevant queries to refresh the UI.

```tsx
import { useDepositConduit } from '@railnetorg/railnet-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'

export function useDepositWithRefresh() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const deposit = useDepositConduit()

  const execute = (conduit: Address, token: Address, amount: bigint) => {
    deposit.mutate({
      conduit,
      token,
      amount,
      account: address!,
    }, {
      onSuccess: () => {
        // Invalidate specific conduit position for this user
        queryClient.invalidateQueries({
          queryKey: ['railnet', 'conduitPosition', { conduit, account: address }]
        })
      }
    })
  }

  return { ...deposit, execute }
}
```

## Common Mistakes

1. **Missing Providers**: Using `useConduitPosition` or other hooks outside of `WagmiProvider` and `QueryClientProvider`. This causes `usePublicClient()` to return `undefined`, leading to immediate runtime crashes when the hook attempts to initialize the query.

2. **Implicit Account Assumption**: Assuming mutation hooks (e.g., `useDepositConduit`) automatically detect the connected wallet. Unlike some wagmi hooks, railnet-sdk mutations require an explicit `account: Address` property in the `mutate` arguments. Failure to pass this results in type errors or runtime failures.

3. **Wrong Chain Configuration**: Configuring `wagmi` for a different chain than the one the conduit lives on. Each chain has its own protocol deployment, so hooks will silently return stale data, zero balances, or fail to find contract addresses because the underlying `publicClient` is pointing to the wrong network.

4. **BigInt Serialization in DevTools**: Passing `bigint` values in query parameters (like `amount` in some estimations). While TanStack Query handles `bigint` in query keys for equality checks, the standard JSON-based DevTools might fail to serialize them, leading to confusing "cannot serialize BigInt" errors in the console during development.

---
See also: railnet-conduit/SKILL.md — hooks wrap these core actions
See also: railnet-core/SKILL.md — chain and client setup
