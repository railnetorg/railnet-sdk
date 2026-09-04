---
'@railnetorg/railnet-sdk': minor
---

Make the React layer chain-aware, and stop it hashing keys it cannot hash.

**Breaking.** The four query-key builders take the chain first:
`conduitPositionQueryKey(chainId, parameters)`.

- **Read hooks take `chainId`.** They called `usePublicClient()` bare, so they read the wallet's
  chain rather than the contract's: a page showing a Base conduit to a wallet on Ethereum read the
  wrong chain. A wagmi config holds every chain's transport, so this needs nothing from the user.
- **`useEstimateConduit` and `usePredictConduitDeployment` threw on every call.** Their parameters
  carry a `bigint`, and TanStack hashes keys with `JSON.stringify`. Bigints are now stringified.
  Casing is untouched: a conduit `name` changes the CREATE2 address a prediction returns.
- **Keys carry the chain, derived from `client.chain?.id`,** so a key cannot name a chain other
  than the one that filled it.
- **Write actions take viem's `chain`.** Unset, it defaulted to `client.chain`, so
  `assertCurrentChain` compared the wallet's chain to itself. Declaring it makes viem check the
  wallet's live `eth_chainId` — for a `json-rpc` account; a local account signs for the declared
  chain and the node rejects a mismatch.
- **`skipToken` replaces the throws inside `queryFn`,** so the exported `*QueryOptions` work
  outside their hook.
- **Read hooks return their `queryKey`,** and each query exports its prefix
  (`conduitPositionQueryPrefix`), for invalidating without rebuilding a key.
