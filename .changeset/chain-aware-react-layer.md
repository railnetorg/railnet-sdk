---
'@railnetorg/railnet-sdk': minor
---

Make the React layer chain-aware, and stop it hashing keys it cannot hash.

**Breaking.** The four query-key builders take the chain as their first argument:
`conduitPositionQueryKey(chainId, parameters)`.

- **Every read hook takes `chainId`.** They called `usePublicClient()` with no argument, so they
  read from whichever chain the wallet was connected to rather than the one holding the contract.
  A page showing a Base conduit to a wallet on Ethereum read the wrong chain. A wagmi config holds
  every chain's transport, so this needs nothing from the user.
- **`useEstimateConduit` and `usePredictConduitDeployment` threw on every call.** Their parameters
  carry a `bigint` — an `Asset` value, `initialExpectedSupply` — and TanStack hashes keys with
  `JSON.stringify`, which refuses a bigint. Key values are now normalised: bigints stringified,
  addresses lowercased so one contract does not occupy two entries with two staleness clocks.
- **Keys carry the chain, derived from `client.chain?.id`** rather than passed alongside the
  client, so a key cannot describe a chain other than the one that filled it.
- **Write actions take viem's `chain`.** They never set it, so it defaulted to `client.chain` and
  viem's `assertCurrentChain` compared the wallet's chain to itself. Declaring the intended chain
  makes that assertion meaningful: viem checks it against the wallet's live `eth_chainId` and
  refuses rather than signing against whatever chain is connected. The protocol is deployed on
  several chains from one CREATE2 factory, so an address can carry a different contract per chain.
  Optional, and only asserted for a `json-rpc` account — a local account signs for the declared
  chain, so a mismatch is rejected by the node instead.
- **A missing client or account skips the query** via `skipToken` instead of throwing inside
  `queryFn`, so the exported `*QueryOptions` are usable on their own — `prefetchQuery`, a route
  loader — and not only behind their hook's `enabled`.
- **Each query exports its prefix** (`conduitPositionQueryPrefix`), so a caller can invalidate a
  family across chains without reconstructing the key.
