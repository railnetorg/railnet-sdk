---
name: railnet-react
description: >
  React hooks and TanStack Query integration for railnet-sdk -
  useConduitPosition, useConduitInfo, useEstimateConduit,
  useDepositConduit, useRedeemConduit, useSpawnConduit,
  useDeployMultiVehicle, useGrantScopedRole, conduitPositionQueryOptions,
  conduitInfoQueryOptions, query key pattern. Requires wagmi +
  @tanstack/react-query. Load when building React UIs for Railnet.
type: framework
library: railnet-sdk
framework: react
library_version: '0.0.0'
requires:
  - railnet-core
sources:
  - 'railnetorg/railnet-sdk:src/react/hooks/*.ts'
  - 'railnetorg/railnet-sdk:src/react/query/*.ts'
---

This skill builds on railnet-core. Read it first for foundational concepts.

## Setup

`railnet-sdk/react` requires `wagmi` and `@tanstack/react-query`. Ensure your application is wrapped in both `WagmiProvider` and `QueryClientProvider`. The SDK is optimized for the Base chain.

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

## Hooks and Components

### Reading Conduit Data

Use `useConduitPosition` to fetch user shares and assets. It returns a standard TanStack Query result.

```tsx
import { useConduitPosition } from 'railnet-sdk/react'
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
import { useDepositConduit } from 'railnet-sdk/react'
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
import { conduitInfoQueryOptions } from 'railnet-sdk/react'
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
import { useDepositConduit } from 'railnet-sdk/react'
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

3. **Wrong Chain Configuration**: Configuring `wagmi` for `mainnet` or other chains while interacting with Railnet conduits deployed on `base`. Hooks will silently return stale data, zero balances, or fail to find contract addresses because the underlying `publicClient` is pointing to the wrong network.

4. **BigInt Serialization in DevTools**: Passing `bigint` values in query parameters (like `amount` in some estimations). While TanStack Query handles `bigint` in query keys for equality checks, the standard JSON-based DevTools might fail to serialize them, leading to confusing "cannot serialize BigInt" errors in the console during development.

---
See also: railnet-conduit/SKILL.md - hooks wrap these core actions
See also: railnet-core/SKILL.md - chain and client setup
