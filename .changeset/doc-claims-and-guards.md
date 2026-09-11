---
'@railnetorg/railnet-sdk': patch
---

Correct the documented claims the contracts contradict, and close two validation gaps.

**Claims that broke a transaction** — `getInitialDepositAmount` told callers to approve before
`spawnConduit`, `spawnMultiVehicle` or `spawnAaveV3Vehicle`. All seven factories pull the deposit,
so the three vehicle spawns shipped with documentation that omitted them, and following it reverts
`InsufficientAllowance`. `setQueues` documented no validation at all, while the engine
rejects an entry on eight distinct checks — including a redeem target that is unlimited, which is
`2n ** 256n - 1n`, the value the SDK teaches as "unlimited" everywhere else. `spawnConduit`
documented no role, and the one it needs is CONDUIT_SPAWN, not the FACTORY_SPAWN every other spawn
builder names.

**Claims about who may call** — `grantScopedRole`, `revokeScopedRole` and `setScopedRolePublic`
each said the caller must be the default admin. `_checkScopedRoleAdmin` asks for the role's own
admin role, held globally *or scoped to the same scope*, so the docs ruled out a delegation the
contract allows. `process` said it was a keeper's call, not an integration's; the query's receiver
may always call it, and only a third party needs CONDUIT_PROCESS.

**Claims about deployment addresses** — `predictFeeManagerDeployment` said only `deploymentSalt`
moved the address. It is a CREATE2 over the proxy's init code, which carries the access control and
every fee field. Same correction on `spawnConduit`.

**Claims about state** — `simulateDispatchVehicle` presented the outcome as `SETTLED` or
`PROCESSING`, and its example kept a `REJECTED` query to progress later, which can never succeed.
The engine bubbles the vehicle's state up unchanged, any member of `QueryState`.
`VehicleCap.value` said an unlimited cap "forces `threshold` to 0 on chain"; `configure` validates
the cap without normalising it, so a non-zero threshold is stored as passed and changes when
`StateUnchanged` fires. `setFees` documented one 0–10000 range for four rates that have two
ceilings.

**Validation gaps** — `assertFeeRecipients` let a zero `target` through, the one entry its
ascending-order pass cannot catch since it can only sit first; the FeeManager reverts
`ZeroAddress`. `buildRemoveFromAllowListCall` and `buildRemoveFromBlockListCall` ran no client-side
check at all, unlike their two `add` counterparts, so an empty batch spent gas on a no-op and a
zero address or a repeat reverted on chain.
