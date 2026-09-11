---
'@railnetorg/railnet-sdk': patch
---

Decode the reverts a call's own ABI cannot carry, and correct four hints.

**Cross-contract reverts** — `protocolErrorsAbi` carried 16 errors and claimed to track
`src/libs/Error.sol` and `BaseVehicleErrors.sol`, which declare 36 between them. viem decodes a
revert against the ABI of the call, so every error raised by a *different* contract in the same
transaction arrived as raw bytes and `getRailnetError` returned `null`. On
`buildSpawnConduitCall` that covered `AssetNotAuthorized` — an unregistered asset, the most common
spawn failure — plus `InvalidInitialDepositSize`, `InvalidInitialExpectedSupply` and
`FailedContractCreation`; on `buildSpawnAaveV3VehicleCall` the four reserve checks the facet runs
in its initializer, `ReservePaused` and `ReserveFrozen` among them; on any call routed through a
vehicle proxy, the beacon's `EnforcedPause`, which is the emergency path. `estimateVehicle` decoded
nothing at all: `baseVehicleAbi` ships no error entries, and the only two reverts
`BaseVehicle.estimate` raises, `InvalidInput` and `ZeroInputValue`, were in neither fragment.

The fragment now holds all 167 error names hangar declares, 169 entries because
`QueryAlreadyRegistered` and `QueryAlreadyWrapped` each exist in two signatures. Selectors are
unique across the set, so the fallback cannot mis-attribute a revert. Only `internalType` changed
on the entries that were already there.

**Hints** — `DisabledVehicle` said "paused or frozen at the beacon". Its single raise site is
`BaseVehicle`'s `enabled` flag; a paused beacon raises `EnforcedPause` instead, and freezing only
blocks upgrades. `PublicRoleAuthDenied` carried the text for `DefaultAdminCannotBePublic`, which
had no entry — it is raised when a scoped role is public, refusing per-account grants.
`NotAllowed` described the sender being refused, which is `CreateNotAllowed`, also missing —
`NotAllowed` screens a third-party receiver. `InvalidPoolAddressesProvider` claimed the provider
was the wrong one; its only check is for zero address or no code.
