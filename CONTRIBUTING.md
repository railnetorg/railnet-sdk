# Contributing

## Setup

```bash
bun install
bun run dev       # symlinks dist/ → src/ for local dev
bun run lint      # type check
bun run format    # biome check --fix
bun run docs:dev  # vocs documentation site
```

The test suite forks Base, so it needs an RPC endpoint and [Foundry](https://getfoundry.sh) on your `PATH` for `anvil`. The address guard also reads the production book on Ethereum. Create a `.env.test` (gitignored):

```
BASE_RPC_URL=https://base-rpc.publicnode.com
MAINNET_RPC_URL=https://ethereum-rpc.publicnode.com
```

Then `bun run test`. Without them the fork and address suites fail; the rest still run.

## Architecture

```
src/
├── abi/               Contract ABIs
├── actions/           Read actions and call builders (organized by domain)
│   └── conduit/       Conduit domain actions + types
├── react/
│   ├── query/         TanStack Query options (usable without React)
│   └── hooks/         React hooks wrapping query options
├── decorator.ts       client.extend(railnetActions) — every read action
├── errors.ts          getRailnetError + the revert hint table
├── utils/
└── types.ts           Protocol-wide types: Asset, Query, QueryMode, QueryState, ...
```

### Layers

```
Hook (useConduitPosition)                    → useQuery(queryOptions)
  ↓
QueryOptions (conduitPositionQueryOptions)   → queryKey + queryFn
  ↓
Action (getConduitPosition)                  → viem readContract
  ↓
ABI (conduitAbi)
```

## Conventions

**Reads** follow the viem pattern: `(client: Client, params) → Promise<result>`.

**Writes are not actions.** A `build{X}Call(params)` builder returns `{ address, abi, functionName,
args }` and sends nothing — the caller simulates and signs. A builder throws only for an invariant
the contract documents and a caller can check without a node.

**Naming** - `{verb}{Domain}.ts`: `depositConduit`, `getConduitPosition`, `estimateConduit`

## Adding a New Action

1. Add ABI entries to `abi/{contract}.ts` if needed
2. Add types to `src/types.ts` if the protocol shares them, `actions/{domain}/types.ts` if the
   domain does, or the action file if they are local
3. Create `actions/{domain}/{actionName}.ts`
4. Export from `actions/{domain}/index.ts`
5. If read action → add to `decorator.ts`. `test/decorator.test.ts` fails until you do
6. If it can revert in a way a caller should handle → add a hint to `railnetErrorHints`
7. If needs React hook → add `react/query/{name}.ts` + `react/hooks/use{Name}.ts` + export from barrels

## Build & Publish

Built with [zile](https://github.com/wevm/zile). `bun run build` (= `zile`) transpiles via tsc and rewrites `package.json` for publish. Don't run build locally - use `bun run dev` instead. The CI handles build + publish via changesets:

```
zile publish:prepare → changeset publish → zile publish:post
```

`[!start-pkg]` in `package.json` separates dev fields (stripped at publish) from package fields.

## Release Process

Never publish from a local terminal. All releases go through CI.

```
1. bunx changeset                        # in your feature branch - pick patch/minor/major
2. git add .changeset/ && git commit     # commit the generated .changeset/*.md file
3. push branch → open PR                 # CI runs verify
4. merge PR into main                    # CI creates a "chore: version packages" PR
5. merge the version PR                  # CI publishes the package
```

No changeset = no publish. You can push to main freely without triggering a release.

## CI Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `verify.yml` | Called by other workflows | Lint, typecheck, tests |
| `pull-request.yml` | PR opened/updated | Runs verify |
| `main.yml` | Push to `main` | Runs verify → changesets (version PR or publish) |
| `validate-skills.yml` | PR touching `skills/` | Validates skill file format |
| `check-skills.yml` | Release, docs/src changes on `main`, or manual | Opens PR if skills need update |
