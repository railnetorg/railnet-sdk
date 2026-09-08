---
'@railnetorg/railnet-sdk': minor
---

Split the address book into a production entry point and a staging one, and resync both onto the
protocol's `v1.0.0` deployment.

**Breaking — the addresses moved.** `v1.0.0` shipped on 2026-09-01 and rotated every protocol
address. The shipped table still held the previous generation, so the SDK was encoding
calls to superseded factories. Both entry points now come from that deployment.

**Breaking — `getAddresses(8453)` throws.** The root holds **production** deployments only, and
Base has none yet: what it runs today is a staging deployment. Answering with it would hand a
partner staging under the name of production.

**New — `@railnetorg/railnet-sdk/staging`.** Railnet runs staging on real mainnet chain ids rather
than on a testnet, so a chain id cannot say which environment you are on. The import path says it
instead: the same `getAddresses` and `isSupportedChain` over the staging tables, which hold Base
`8453` and Ethereum `1`. Each entry point has one deployment per chain, so `getAddresses(chainId)`
is unambiguous within either, and importing the root cannot reach a staging address by accident.

When Base's production deployment ships it lands in the root, and nothing else changes.

**New — `startedAtBlock`** on every deployment: the block an indexer or a log scan should begin at.

`ChainAddresses.wrapperVehicleFactory` is now optional — the Ethereum production deployment ships
no wrapper vehicle.
