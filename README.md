<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/logo-light.svg">
    <img alt="Railnet SDK" src="public/logo-dark.svg" width="200">
  </picture>
</p>

# railnet-sdk

TypeScript SDK for interacting with the Railnet protocol. Built on [viem](https://viem.sh), with first-class support for [React](https://react.dev) and [TanStack Query](https://tanstack.com/query).

Documentation: **[sdk.railnet.org](https://sdk.railnet.org)**

## Installation

This package is published on [GitHub Packages](https://github.com/railnetorg/railnet-sdk/packages). Configure npm to use the GitHub Packages registry for the `@railnetorg` scope.

**1. Authenticate with GitHub Packages**

Create a `.npmrc` in your project root (or `~/.npmrc` globally):

```
@railnetorg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

The token needs the `read:packages` scope. [Create one here](https://github.com/settings/tokens/new?scopes=read:packages).

**2. Install**

```bash
npm install @railnetorg/railnet-sdk viem
```

For React hooks, also install:

```bash
npm install wagmi @tanstack/react-query
```

## Usage

### Standalone Actions

```ts
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { getConduitPosition } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: base,
  transport: http(),
})

const position = await getConduitPosition(client, {
  conduit: '0x3d9e60ccee8477577c95d2faf4f127fea8745da9',
  account: '0x991c468AbcE2b4DD627a6210C145373EbABdd186',
})
```

### Client Decorator

```ts
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { railnetActions } from '@railnetorg/railnet-sdk'

const client = createPublicClient({
  chain: base,
  transport: http(),
}).extend(railnetActions)

const position = await client.getConduitPosition({
  conduit: '0x3d9e60ccee8477577c95d2faf4f127fea8745da9',
  account: '0x991c468AbcE2b4DD627a6210C145373EbABdd186',
})
```

### React Hooks

```tsx
import { useConduitPosition } from '@railnetorg/railnet-sdk/react'

function Position() {
  const { data, isLoading } = useConduitPosition({
    conduit: '0x3d9e60ccee8477577c95d2faf4f127fea8745da9',
    account: '0x991c468AbcE2b4DD627a6210C145373EbABdd186',
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
| `@railnetorg/railnet-sdk` | Core actions, ABIs, types and utilities |
| `@railnetorg/railnet-sdk/react` | React hooks and TanStack Query integrations |

## Supported chains

| Chain | ID |
|---|---|
| Base | `8453` |
| Ethereum | `1` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, architecture, adding new actions, and release process.