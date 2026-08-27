---
name: railnet-access-control
description: >
  Manage Railnet role-based access control — spawnAccessControl,
  grantScopedRole, revokeScopedRole, setScopedRolePublic,
  extractAccessControlAddress, role constants (VEHICLE_STEAM_DEPOSIT,
  MULTI_VEHICLE_DISPATCH, MULTI_VEHICLE_MOVE,
  MULTI_VEHICLE_SET_QUEUES, DEFAULT_ADMIN_ROLE, etc.),
  scope targeting rules. Load when setting up permissions, granting
  roles, or debugging MissingRole revert errors.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/accessControl/*.ts'
  - 'railnetorg/railnet-sdk:src/constants/roles.ts'
---

# Railnet Access Control

ExternalAccessControl (EAC) is the central permissioning system for Railnet. It uses scoped roles to grant specific permissions on specific contracts (scopes). This skill covers spawning EAC instances and managing granular role assignments.

## Setup

```typescript
import { createWalletClient, createPublicClient, http, type Hex, type Address } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { getAddresses } from '@railnetorg/railnet-sdk'

const publicClient = createPublicClient({ chain: base, transport: http() })
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const walletClient = createWalletClient({ account, chain: base, transport: http() })
const addresses = getAddresses(base.id)
```

## Core Patterns

### 1. Spawning Access Control
Spawning a new EAC instance defines the initial admin and optional roles.

```typescript
import { spawnAccessControl, extractAccessControlAddress, randomSalt } from '@railnetorg/railnet-sdk'
import { VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'

const hash = await spawnAccessControl(walletClient, {
  factory: addresses.eacFactory,
  initialDefaultAdmin: account.address,
  // initialDelay is optional — defaults to 0
  // initialRoles is optional — defaults to []
  deploymentSalt: randomSalt(), // required: it fixes the deployed address
  initialRoles: [
    { account: '0x...', role: VEHICLE_STEAM_DEPOSIT as Hex }
  ],
  account: account.address,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const accessControlAddress = extractAccessControlAddress(receipt, addresses.eacFactory)
```

### 2. Granting Scoped Roles
Roles in Railnet are almost always "scoped" to a specific contract. Granting a role without the correct scope will result in `MissingRole` reverts during protocol operations.

```typescript
import { grantScopedRole, MULTI_VEHICLE_DISPATCH } from '@railnetorg/railnet-sdk'

const hash = await grantScopedRole(walletClient, {
  accessControl: '0x...', // EAC address
  role: MULTI_VEHICLE_DISPATCH as Hex,
  scope: '0x...', // MUST be the SectorAccountingEngine address for this role
  grantee: '0x...', // Address receiving the permission
  account: account.address, // Caller must have DEFAULT_ADMIN_ROLE
})
```

### 3. Revoking Scoped Roles
Revoking permissions follows the same scoped pattern.

```typescript
import { revokeScopedRole, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'

await revokeScopedRole(walletClient, {
  accessControl: '0x...',
  role: VEHICLE_STEAM_DEPOSIT as Hex,
  scope: '0x...', // Vehicle or Multi-Vehicle address
  grantee: '0x...',
  account: account.address,
})
```

### 4. Setting Roles as Public
Make a scoped role callable by any address, or restrict it back to specific grantees.

```typescript
import { setScopedRolePublic, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'

// Make VEHICLE_STEAM_DEPOSIT public on a specific vehicle scope
const hash = await setScopedRolePublic(walletClient, {
  accessControl: '0x...',
  role: VEHICLE_STEAM_DEPOSIT as Hex,
  scope: vehicleAddress, // The vehicle scope to make public
  isPublic: true,
  account: account.address, // Caller must have DEFAULT_ADMIN_ROLE
})
```

Note: The `deployMultiVehicle` workflow checks `isScopedRolePublic` before granting `VEHICLE_STEAM_DEPOSIT` per vehicle. If the role is already public on a vehicle's scope, it skips the individual grants.

## Common Mistakes

1. **CRITICAL: Scoping role to wrong contract address**
Most Multi-Vehicle (MV) roles must be scoped to the `SectorAccountingEngine`, NOT the `MultiVehicle` contract itself. For example, `MULTI_VEHICLE_SET_QUEUES` must be scoped to the `QueueStrategyEngine`. Granting to the wrong scope succeeds silently but operations will revert with `MissingRole`.
*   **Wrong**: `grantScopedRole(walletClient, { role: MULTI_VEHICLE_DISPATCH, scope: multiVehicleAddress, ... })`
*   **Correct**: `grantScopedRole(walletClient, { role: MULTI_VEHICLE_DISPATCH, scope: sectorAccountingEngineAddress, ... })`

2. **CRITICAL: Write actions take a single client, not two**
*   **Wrong**: `grantScopedRole(publicClient, walletClient, { ... })`
*   **Correct**: `grantScopedRole(walletClient, { ... })`

All write actions take `(client, parameters, options?)` — a single viem client that handles both simulation and signing internally.

3. **HIGH: Using raw keccak256 strings instead of SDK constants**
Manual computation of role hashes (e.g., `keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))`) risks typos that produce valid but incorrect role hashes. Always use the precomputed constants exported by the SDK.
*   **Wrong**: `const role = keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))`
*   **Correct**: `import { VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'`

4. **MEDIUM: Role constants type mismatch**
SDK role constants are exported as strings, but `grantScopedRole` and `revokeScopedRole` expect the `Hex` type. You must cast them to avoid TypeScript errors.
*   **Wrong**: `{ role: VEHICLE_STEAM_DEPOSIT }`
*   **Correct**: `{ role: VEHICLE_STEAM_DEPOSIT as Hex }`

5. **HIGH: Not extracting EAC address from receipt**
`spawnAccessControl` returns a transaction hash, not the contract address. You must use `extractAccessControlAddress` on the transaction receipt to get the address for subsequent configuration or for use in `spawnConduit`.

6. **HIGH: Misunderstanding `deployMultiVehicle` auto-grants**
The `deployMultiVehicle` workflow checks if `VEHICLE_STEAM_DEPOSIT` is already public on each vehicle scope. If not, it grants `VEHICLE_STEAM_DEPOSIT` to three specific addresses per vehicle (multiVehicle, sectorAccountingEngine, subQueryEngine). If your security model requires custom role hierarchies, skip the workflow and use individual `grantScopedRole` / `setScopedRolePublic` calls with correct scopes.

## References

- [Role to Scope Mapping](./references/role-reference.md)
- [Vehicle Deployment](../railnet-vehicle/SKILL.md)
- [Conduit Spawning](../railnet-conduit/SKILL.md)
