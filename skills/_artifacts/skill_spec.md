# Skill Specification - railnet-sdk

## Library Overview

railnet-sdk is a TypeScript SDK for the Railnet protocol - institutional-grade DeFi
infrastructure for yield structuring and distribution. It wraps on-chain smart contracts
(Conduits, Vehicles, Multi-Vehicles, ExternalAccessControl) with typed viem actions,
TanStack Query options, and React/wagmi hooks.

## Developer Personas

| Persona | Tasks | Skills needed |
|---------|-------|---------------|
| Platform integrator | Deploy conduits, handle deposits/withdrawals, configure access control | railnet-core, railnet-conduit, railnet-access-control |
| Asset manager | Deploy vehicles and multi-vehicles, authorize vehicles, set queues, rebalance | railnet-core, railnet-vehicle, railnet-access-control |
| App developer | Build React UIs for deposits/redemptions, display positions | railnet-core, railnet-conduit, railnet-react |

## Architecture

Three API layers:
1. **Standalone viem actions** - `(client, params) => Hash` for writes, `(client, params) => Data` for reads
2. **TanStack Query options** - `queryOptions({ queryKey, queryFn })` for framework-agnostic caching
3. **React hooks** - wagmi-based hooks wrapping the above two layers

## Chain Support

`getAddresses` holds production deployments, which today means Ethereum (chain 1) alone. Staging
runs on real mainnet chain ids, Ethereum and Base (8453), behind the separate
`@railnetorg/railnet-sdk/staging` entry point. A chain id does not identify the environment; the
import path does.

## Key Design Decisions

- Writes are call builders returning `{ address, abi, functionName, args }`. The SDK never sends
  them: simulate on a public client, then send the request with a wallet
- Nothing in the SDK sends an ERC-20 approval
- Account parameter is always explicit (never auto-injected from wallet)
- Role constants are precomputed keccak256 hashes exported as `Hex` strings
- Deploying a multi-vehicle is 8+ sequential transactions the caller sends. There is no
  `deployMultiVehicle` helper

## Out of Scope

- APY/historical performance data (requires indexer or public API)
- Keeper automation (off-chain infrastructure)
- Fee configuration beyond what the SDK exposes
- Chains beyond the ones `getAddresses` ships (Ethereum, Base)
