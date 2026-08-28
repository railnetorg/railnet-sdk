# Contributing

## Setup

```bash
bun install
bun run dev       # symlinks dist/ → src/ for local dev
bun run lint      # type check
bun run format    # biome check --fix
bun run docs:dev  # vocs documentation site
```

The test suite forks Base, so it needs an RPC endpoint and [Foundry](https://getfoundry.sh) on your `PATH` for `anvil`. Create a `.env.test` (gitignored):

```
BASE_RPC_URL=https://base-rpc.publicnode.com
```

Then `bun run test`. Without it three fork suites fail; the rest still run.

## Architecture

```
src/
├── abi/               Contract ABIs
├── actions/           Core read/write actions (organized by domain)
│   └── conduit/       Conduit domain actions + types
├── react/
│   ├── query/         TanStack Query options (usable without React)
│   └── hooks/         React hooks wrapping query options
├── decorator.ts       client.extend(railnetActions)
├── utils/
└── types.ts           Shared types
```

### Layers

```
Hook (useConduitPosition)                    → useQuery(queryOptions)
  ↓
QueryOptions (conduitPositionQueryOptions)   → queryKey + queryFn
  ↓
Action (getConduitPosition)                  → viem readContract / writeContract
  ↓
ABI (conduitAbi)
```

## Conventions

**Actions** follow the viem pattern:
- Read: `(client: Client, params) → Promise<result>`
- Write: `(client: Client, params & { account: Address }) → Promise<result>`

**Naming** - `{verb}{Domain}.ts`: `depositConduit`, `getConduitPosition`, `estimateConduit`

## Adding a New Action

1. Add ABI entries to `abi/{contract}.ts` if needed
2. Add types to `actions/{domain}/types.ts` if shared, or in the action file if local
3. Create `actions/{domain}/{actionName}.ts`
4. Export from `actions/{domain}/index.ts`
5. If read action → add to `decorator.ts`
6. If needs React hook → add `react/query/{name}.ts` + `react/hooks/use{Name}.ts` + export from barrels

## Build & Publish

Built with [zile](https://github.com/wevm/zile). `bun run build` (= `zile`) transpiles via tsc and rewrites `package.json` for publish. Don't run build locally - use `bun run dev` instead. The CI handles build + publish via changesets:

```
zile publish:prepare → changeset publish → zile publish:post
```

`[!start-pkg]` in `package.json` separates dev fields (stripped at publish) from package fields.

## Release Process

Never publish from a local terminal. All releases go through CI → GitHub Packages.

```
1. bunx changeset                        # in your feature branch - pick patch/minor/major
2. git add .changeset/ && git commit     # commit the generated .changeset/*.md file
3. push branch → open PR                 # CI runs verify
4. merge PR into main                    # CI creates a "chore: version packages" PR
5. merge the version PR                  # CI publishes to GitHub Packages
```

No changeset = no publish. You can push to main freely without triggering a release.

Package is published as `@railnetorg/railnet-sdk` on GitHub Packages (private registry).

## CI Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `verify.yml` | Called by other workflows | Lint, typecheck, tests |
| `pull-request.yml` | PR opened/updated | Runs verify |
| `main.yml` | Push to `main` | Runs verify → changesets (version PR or publish) |
| `validate-skills.yml` | PR touching `skills/` | Validates skill file format |
| `check-skills.yml` | Release, docs/src changes on `main`, or manual | Opens PR if skills need update |
