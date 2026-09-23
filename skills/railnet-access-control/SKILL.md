---
name: railnet-access-control
description: >
  Manage Railnet role-based access control — buildSpawnAccessControlCall,
  buildGrantScopedRoleCall, buildRevokeScopedRoleCall,
  buildSetScopedRolePublicCall, buildGrantRoleCall, buildRevokeRoleCall,
  buildRenounceRoleCall, buildRenounceScopedRoleCall, buildSetRolePublicCall,
  getHasRole, getPendingDefaultAdmin, buildBeginDefaultAdminTransferCall,
  buildAcceptDefaultAdminTransferCall, buildCancelDefaultAdminTransferCall,
  extractAccessControlAddress, role constants (VEHICLE_STEAM_DEPOSIT,
  MULTI_VEHICLE_DISPATCH, MULTI_VEHICLE_MOVE, MULTI_VEHICLE_SET_QUEUES,
  FEE_MANAGER_SET_FEES, ACCOUNT_LIST_MANAGER, DEFAULT_ADMIN_ROLE) and the
  scope targeting rules. Load when setting up permissions, granting global or
  scoped roles, making a role public, or debugging a MissingRole revert.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.8.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/accessControl/*.ts'
  - 'railnetorg/railnet-sdk:src/constants/roles.ts'
---

# Railnet Access Control

ExternalAccessControl is the permissioning contract every Railnet module is gated by. A grant is
either global, applying across every scope, or scoped to one contract address.

The scope is always the contract that performs the check, because every `_onlyGatedRole` passes
`address(this)`. `MULTI_VEHICLE_*` is a family name, not a scope: most of those roles are granted
against an engine, not against the multi vehicle.

## Setup

```typescript
import { getAddresses } from '@railnetorg/railnet-sdk'
import { mainnet } from 'viem/chains'
import { simulateContract, writeContract } from 'viem/actions'

const addresses = getAddresses(mainnet.id)
// publicClient simulates and reads. walletClient signs.
```

## Core Patterns

### Spawning an access control

```typescript
import {
  buildSpawnAccessControlCall, extractAccessControlAddress, randomSalt,
  VEHICLE_STEAM_DEPOSIT,
} from '@railnetorg/railnet-sdk'

const hash = await writeContract(
  walletClient,
  (await simulateContract(publicClient, {
    ...buildSpawnAccessControlCall({
      factory: addresses.eacFactory,
      initialDefaultAdmin: account.address,
      deploymentSalt: randomSalt(), // fixes the deployed address
      // initialDelay optional, defaults to 0
      // initialRoles optional, defaults to []
      initialRoles: [{ account: operator, role: VEHICLE_STEAM_DEPOSIT }],
    }),
    account: account.address,
  })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const accessControl = extractAccessControlAddress(receipt, addresses.eacFactory)
```

`initialRoles` grants are global, not scoped. A role that should apply to one contract goes through
`buildGrantScopedRoleCall` after the spawn.

`addresses.adminEac` is the deployment's own access control. Reuse it only when the modules should
answer to the protocol admin rather than to you.

### Scoped roles

```typescript
import { buildGrantScopedRoleCall, buildRevokeScopedRoleCall, MULTI_VEHICLE_SET_QUEUES } from '@railnetorg/railnet-sdk'

const grant = buildGrantScopedRoleCall({
  accessControl,
  role: MULTI_VEHICLE_SET_QUEUES,
  scope: queueStrategyEngine, // the contract that performs the check
  grantee: operator,
})

const revoke = buildRevokeScopedRoleCall({ accessControl, role: MULTI_VEHICLE_SET_QUEUES, scope: queueStrategyEngine, grantee: operator })
```

The caller must hold the role's admin role, which is `DEFAULT_ADMIN_ROLE` unless it was reassigned,
either globally or scoped to the same `scope`. Both revert `PublicRoleAuthDenied` when that scoped
role is already public, because a public role has nobody to grant it to.

`buildRenounceScopedRoleCall` gives up a scoped role. It needs no admin role, and `account` must be
the sender or the contract reverts `OnlyOwnerCanRenounce`.

Source: src/actions/accessControl/grantScopedRole.ts, src/actions/accessControl/revokeScopedRole.ts, src/actions/accessControl/renounceScopedRole.ts

### Global roles

A global grant applies across every scope at once. Use it for an operator that must act on contracts
not yet deployed, and prefer a scoped grant everywhere else.

```typescript
import { buildGrantRoleCall, buildRenounceRoleCall, buildRevokeRoleCall } from '@railnetorg/railnet-sdk'

const grant = buildGrantRoleCall({ accessControl, role, account: operator })
const revoke = buildRevokeRoleCall({ accessControl, role, account: operator })
const renounce = buildRenounceRoleCall({ accessControl, role, callerConfirmation: account.address })
```

`role` must be a base role, as `keccak256(name)`, which is the form the `constants/roles` exports
take. Never pass a role already encoded against a scope: `grantRole` cannot tell the two apart and
would grant the encoded value as a base role under the global admin, skipping every scoped-role
semantic.

Revoking a global role leaves a scoped grant of the same role untouched. `callerConfirmation` on a
renounce must be the sender, because the contract compares it against `msg.sender`.

Both grant and revoke revert `PublicRoleAuthDenied` on an already public role, and
`AccessControlEnforcedDefaultAdminRules` for `DEFAULT_ADMIN_ROLE`. A renounce of
`DEFAULT_ADMIN_ROLE` reverts `DefaultAdminCannotBeRenounced`.

`DEFAULT_ADMIN_ROLE` moves only through the two-step handover: the current admin sends
`buildBeginDefaultAdminTransferCall`, which schedules it `defaultAdminDelay` seconds out, then the
incoming admin sends `buildAcceptDefaultAdminTransferCall`. Accepting before the schedule reverts
`AccessControlEnforcedDefaultAdminDelay`, and `getPendingDefaultAdmin` reads that schedule.
`buildCancelDefaultAdminTransferCall` drops a pending handover.

Source: src/actions/accessControl/globalRoles.ts, src/actions/accessControl/defaultAdminTransfer.ts

### Public roles

Making a role public lets any address call the gated function. It is how a vehicle is opened to a
multi vehicle's engines without three grants per vehicle.

```typescript
import { buildSetRolePublicCall, buildSetScopedRolePublicCall } from '@railnetorg/railnet-sdk'

// Public on one contract
const scoped = buildSetScopedRolePublicCall({ accessControl, role, scope: vehicle, isPublic: true })

// Public everywhere
const global = buildSetRolePublicCall({ accessControl, role, isPublic: true })
```

`buildSetRolePublicCall` needs `DEFAULT_ADMIN_ROLE`, not the role's own admin. Both revert
`DefaultAdminCannotBePublic` on `DEFAULT_ADMIN_ROLE` and `RolePublicStatusUnchanged` when the status
already holds.

### Checking a role before sending

```typescript
import { getHasRole, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'

const allowed = await getHasRole(publicClient, {
  accessControl,
  role: VEHICLE_STEAM_DEPOSIT,
  scope: vehicle, // the contract performing the gated call
  account: subQueryEngine,
})
```

`getHasRole` mirrors what the contracts check. It reads `hasRoleOrScopedRole`, the function behind
`AccessControlLib.gatedCheckRole` and `ungatedCheckRole`, so `true` means the gated call will not
revert on the role check. It covers both a global and a scoped grant, and a public role reads as
held by every account.

## Common Mistakes

### CRITICAL Scoping a role to the wrong contract

The scope is the contract that performs the check, not the product it belongs to. Granting to the
wrong scope succeeds silently, and the revert arrives later as `MissingRole` on an unrelated call.

```diff
- buildGrantScopedRoleCall({ role: MULTI_VEHICLE_DISPATCH, scope: multiVehicle, grantee })
+ buildGrantScopedRoleCall({ role: MULTI_VEHICLE_DISPATCH, scope: sectorAccountingEngine, grantee })
```

`MULTI_VEHICLE_SET_QUEUES` goes to the QueueStrategyEngine, `MULTI_VEHICLE_PROGRESS_QUERY` to the
SubQueryEngine, `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` and `MULTI_VEHICLE_SET_THRESHOLDS` to the
VehicleManager. Check the table in references/role-reference.md rather than guessing from the name.

### CRITICAL Passing a scope-encoded role to a global call

`buildGrantRoleCall`, `buildRevokeRoleCall`, `buildRenounceRoleCall` and `buildSetRolePublicCall`
take a base role. Handing one of them a value already encoded against a scope does not fail: the
contract grants that value as a base role under the global admin, and every scoped-role semantic is
skipped. The permission you meant to give is never granted, and one you did not intend exists.

Source: src/actions/accessControl/globalRoles.ts

### CRITICAL Reads and simulations do not belong on the wallet client

```typescript
const { request } = await simulateContract(publicClient, { ...buildGrantScopedRoleCall({ /* … */ }), account })
const hash = await writeContract(walletClient, request)
```

Only signing needs the wallet. A wallet answers reads from whatever node it picked, at whatever
freshness it keeps. A script with a single client uses it for both, which is fine: it chose that
transport.

### HIGH Computing role hashes by hand

`keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))` produces a valid hash that is not the role, if the name
is off by a character. The constants are precomputed and exported; import them.

### HIGH Not reading the address back from the receipt

`buildSpawnAccessControlCall` yields a transaction hash. `extractAccessControlAddress(receipt, factory)`
returns the address, or `null` when the event is absent. Every later grant and every
`spawnConduit` needs it.

### HIGH Assuming a deployment sequence grants every role

The multi-vehicle sequence grants `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM` to three
addresses per vehicle, the MultiVehicle, the SectorAccountingEngine and the SubQueryEngine, when the
role is not already public on that vehicle's scope. It grants nothing else. A different security
model is built from `buildGrantScopedRoleCall` and `buildSetScopedRolePublicCall` with your own
scopes.

## References

- [Role to Scope Mapping](references/role-reference.md)

See also: railnet-vehicle/SKILL.md — the deployment sequence and which grant each step needs.

See also: railnet-conduit/SKILL.md — a conduit and each of its modules are gated by this contract.
