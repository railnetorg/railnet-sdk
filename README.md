<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/public/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs/public/logo-light.svg">
    <img alt="Railnet SDK" src="docs/public/logo-dark.svg" width="200">
  </picture>
</p>

# railnet-sdk

TypeScript SDK for interacting with the Railnet protocol. Built on [viem](https://viem.sh), with first-class support for [React](https://react.dev) and [TanStack Query](https://tanstack.com/query).

## Installation

```bash
npm install railnet-sdk viem
```

For React hooks, also install:

```bash
npm install wagmi @tanstack/react-query
```

## Usage

### Standalone Actions

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getConduitPosition } from 'railnet-sdk'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const position = await getConduitPosition(client, {
  conduit: '0x...',
  account: '0x...',
})
```

### Client Decorator

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { railnetActions } from 'railnet-sdk'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(railnetActions)

const position = await client.getConduitPosition({
  conduit: '0x...',
  account: '0x...',
})
```

### React Hooks

```tsx
import { useConduitPosition } from 'railnet-sdk/react'

function Position() {
  const { data, isLoading } = useConduitPosition({
    conduit: '0x...',
    account: '0x...',
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Shares: {data?.shares.toString()}</p>
      <p>Assets: {data?.assets.toString()}</p>
    </div>
  )
}
```

## Packages

| Export | Description |
|---|---|
| `railnet-sdk` | Core actions, ABIs, types and utilities |
| `railnet-sdk/react` | React hooks and TanStack Query integrations |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, architecture, adding new actions, and release process.