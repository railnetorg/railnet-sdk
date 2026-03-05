# railnet-sdk

TypeScript SDK for interacting with the Railnet protocol (Conduits, MultiVehicles, STEAM).

## Setup

```bash
bun install
bun run dev          # symlinks dist/ → src/ for local dev
bun run check:types  # type check
bun run docs:dev     # vocs documentation site
```

## Package Entrypoints

| Import | Requires | Usage |
|---|---|---|
| `railnet-sdk` | `viem` | Actions, ABIs, types, decorator |
| `railnet-sdk/react` | `wagmi` + `@tanstack/react-query` | Hooks + query options |

## Architecture

```
src/
├── abi/                          ABI const arrays (as const for type inference)
│   ├── conduit.ts
│   └── conduitFactory.ts
├── actions/                      Barrel re-export per domain
│   ├── conduit/                  Domain: Conduit
│   │   ├── types.ts              Domain-specific types (enums, params, return types)
│   │   ├── getConduitPosition.ts Read action  — (client, params) → result
│   │   ├── depositConduit.ts     Write action — (walletClient, params & { account }) → result
│   │   └── index.ts              Barrel export
│   └── index.ts                  export * from './conduit/index.js'
├── react/
│   ├── query/                    TanStack Query options (usable without React)
│   │   └── conduitPosition.ts    queryKey + queryFn → calls action
│   ├── hooks/                    React hooks (thin wrappers)
│   │   └── useConduitPosition.ts useQuery(queryOptions)
│   └── index.ts
├── decorator.ts                  client.extend(railnetActions) for read actions
├── utils/
│   └── receipt.ts                Transaction receipt helpers
├── types.ts                      Cross-domain shared types (empty until needed)
└── index.ts                      Main entrypoint
```

## Layers

```
Hook (useConduitPosition)          → useQuery(queryOptions)
  ↓
QueryOptions (conduitPositionQueryOptions) → queryKey + queryFn
  ↓
Action (getConduitPosition)        → viem readContract / multicall / writeContract
  ↓
ABI (conduitAbi)                   → as const for type inference
```

## Conventions

**Types** — defined at the closest scope:
- Used in 1 file → defined in that file (e.g. `SpawnConduitReturnType` in `spawnConduit.ts`)
- Used across a domain → `actions/{domain}/types.ts`
- Used across domains → `src/types.ts`

**Actions** — follow the viem pattern:
- Read: `(client: Client, params) → Promise<result>`
- Write: `(walletClient: WalletClient, params & { account: Address }) → Promise<result>`
- `account` is always separated from contract params via `& { account }` (execution context vs contract args)

**Naming** — `{verb}{Domain}.ts`: `depositConduit`, `getConduitPosition`, `estimateConduit`

**Imports** — always relative with `.js` extension (required by `module: nodenext`)

**ABIs** — use `as const` for viem type inference. No barrel file, imported directly.

## Adding a New Action

1. Add ABI entries to `abi/{contract}.ts` if needed
2. Add types to `actions/{domain}/types.ts` if shared, or in the action file if local
3. Create `actions/{domain}/{actionName}.ts`
4. Export from `actions/{domain}/index.ts`
5. If read action → add to `decorator.ts`
6. If needs React hook → add `react/query/{name}.ts` + `react/hooks/use{Name}.ts` + export from barrels

## Build & Publish

Built with [zile](https://github.com/wevm/zile). `bun run build` (= `zile`) transpiles via tsc and rewrites `package.json` for publish. Don't run build locally — use `bun run dev` instead. The CI handles build + publish via changesets:

```
zile publish:prepare → changeset publish → zile publish:post
```

`[!start-pkg]` in `package.json` separates dev fields (stripped at publish) from package fields.

## Release Process

Never publish from a local terminal. All releases go through CI.

```
1. bunx changeset                        # in your feature branch — pick patch/minor/major
2. git add .changeset/ && git commit     # commit the generated .changeset/*.md file
3. push branch → open PR                 # CI runs verify + prerelease preview
4. merge PR into main                    # CI creates a "chore: version packages" PR
5. merge the version PR                  # CI publishes to npm
```

No changeset = no publish. You can push to main freely without triggering a release.