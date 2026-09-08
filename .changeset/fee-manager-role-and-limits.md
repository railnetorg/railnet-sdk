---
'@railnetorg/railnet-sdk': minor
---

Add the FeeManager, a scoped role check, and the multi vehicle's operations.

**FeeManager** — `buildSpawnFeeManagerCall`, `predictFeeManagerDeployment`, `buildSetFeesCall`,
`buildSetFeeRecipientsCall`, `buildDispatchFeesCall`. A conduit takes its fee manager at spawn and
has no setter for it, so a caller that could not deploy one was stuck charging nothing. Recipients
must be non-empty, strictly ascending by `target`, and sum to 10000 bps; `initialMaxFees` are
ceilings `setFees` can never exceed.

**`getHasRole`** / **`useHasRole`** — calls `hasRoleOrScopedRole`, the function the contracts gate
on, so a `false` means the write is going to revert. `scope` is the contract performing the gated
call.

**Multi vehicle** — `buildConfigureVehicleCall`, `buildUnauthorizeVehicleCall`,
`buildSetThresholdsCall`, `buildSetMaxTotalAssetsCall`, and `getVehicleManagerLimits` /
`useVehicleManagerLimits`. The setters replace their value outright, so read the limits first.
`unauthorize` does not unwind holdings. Caps are in the sub-vehicle's shares, the withdrawal buffer
in the multi vehicle's assets, and `2n ** 256n - 1n` means no limit.
