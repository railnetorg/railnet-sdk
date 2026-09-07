---
name: railnet-access-control
description: >
  Manage Railnet role-based access control — buildSpawnAccessControlCall,
  buildGrantScopedRoleCall, buildRevokeScopedRoleCall, buildSetScopedRolePublicCall,
  extractAccessControlAddress, role constants (VEHICLE_STEAM_DEPOSIT,
  MULTI_VEHICLE_DISPATCH, MULTI_VEHICLE_MOVE,
  MULTI_VEHICLE_SET_QUEUES, DEFAULT_ADMIN_ROLE, etc.),
  scope targeting rules. Load when setting up permissions, granting
  roles, or debugging MissingRole revert errors.
metadata:
  type: core
  library: railnet-sdk
  library_version: '0.3.1'
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
import { extractAccessControlAddress, buildSpawnAccessControlCall, randomSalt } from '@railnetorg/railnet-sdk'
import { VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSpawnAccessControlCall({
      factory: addresses.eacFactory,
      initialDefaultAdmin: account.address,
      // initialDelay is optional — defaults to 0
      // initialRoles is optional — defaults to []
      deploymentSalt: randomSalt(), // required: it fixes the deployed address
      initialRoles: [
      { account: '0x...', role: VEHICLE_STEAM_DEPOSIT }
      ],
      account: account.address,
    }), account: account.address })).request,
)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const accessControlAddress = extractAccessControlAddress(receipt, addresses.eacFactory)
```

### 2. Granting Scoped Roles
Roles in Railnet are almost always "scoped" to a specific contract. Granting a role without the correct scope will result in `MissingRole` reverts during protocol operations.

```typescript
import { MULTI_VEHICLE_DISPATCH, buildGrantScopedRoleCall } from '@railnetorg/railnet-sdk'

const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildGrantScopedRoleCall({
      accessControl: '0x...', // EAC address
      role: MULTI_VEHICLE_DISPATCH,
      scope: '0x...', // MUST be the SectorAccountingEngine address for this role
      grantee: '0x...', // Address receiving the permission
      account: account.address, // Caller must have DEFAULT_ADMIN_ROLE
    }), account: account.address })).request,
)
```

### 3. Revoking Scoped Roles
Revoking permissions follows the same scoped pattern.

```typescript
import { VEHICLE_STEAM_DEPOSIT, buildRevokeScopedRoleCall } from '@railnetorg/railnet-sdk'

writeContract(
  client,
  (await simulateContract(client, { ...buildRevokeScopedRoleCall({
      accessControl: '0x...',
      role: VEHICLE_STEAM_DEPOSIT,
      scope: '0x...', // Vehicle or Multi-Vehicle address
      grantee: '0x...',
      account: account.address,
    }), account: account.address })).request,
)
```

### 4. Setting Roles as Public
Make a scoped role callable by any address, or restrict it back to specific grantees.

```typescript
import { VEHICLE_STEAM_DEPOSIT, buildSetScopedRolePublicCall } from '@railnetorg/railnet-sdk'

// Make VEHICLE_STEAM_DEPOSIT public on a specific vehicle scope
const hash = writeContract(
  client,
  (await simulateContract(client, { ...buildSetScopedRolePublicCall({
      accessControl: '0x...',
      role: VEHICLE_STEAM_DEPOSIT,
      scope: vehicleAddress, // The vehicle scope to make public
      isPublic: true,
      account: account.address, // Caller must have DEFAULT_ADMIN_ROLE
    }), account: account.address })).request,
)
```

Note: check `isScopedRolePublic` before granting `VEHICLE_STEAM_DEPOSIT` per vehicle. If the role is already public on a vehicle's scope, the individual grants are redundant.

### 5. Call Builders

`buildSpawnAccessControlCall`, `buildGrantScopedRoleCall`, `buildRevokeScopedRoleCall` and
`buildSetScopedRolePublicCall` return the viem contract call instead of sending it. They are
synchronous, take no client, and send nothing.

```typescript
import { buildRevokeScopedRoleCall } from '@railnetorg/railnet-sdk'

const prepared = buildRevokeScopedRoleCall({
  accessControl: eacAddress,
  role: ROLE_CONDUIT_MANAGER,
  scope: conduitAddress,
  grantee: managerAddress,
})

const hash = await walletClient.writeContract({ ...prepared, account, chain: base })
```

Useful for batching several role changes into one multicall or Safe transaction.

## Common Mistakes

1. **CRITICAL: Scoping role to wrong contract address**
Most Multi-Vehicle (MV) roles must be scoped to the `SectorAccountingEngine`, NOT the `MultiVehicle` contract itself. For example, `MULTI_VEHICLE_SET_QUEUES` must be scoped to the `QueueStrategyEngine`. Granting to the wrong scope succeeds silently but operations will revert with `MissingRole`.
*   **Wrong**: `buildGrantScopedRoleCall({ role: MULTI_VEHICLE_DISPATCH, scope: multiVehicleAddress, ... })`
*   **Correct**: `buildGrantScopedRoleCall({ role: MULTI_VEHICLE_DISPATCH, scope: sectorAccountingEngineAddress, ... })`

2. **CRITICAL: Reads and simulations do not belong on the wallet client**
*   **Wrong**: `simulateContract(walletClient, { ...buildGrantScopedRoleCall({ ... }) })`
*   **Correct**: `simulateContract(publicClient, { ...buildGrantScopedRoleCall({ ... }), account })`, then `writeContract(walletClient, request)`

Simulate on the public client and sign with the wallet. Only signing needs the wallet; a wallet answers reads from whatever node it picked. A script with a single client uses it for both — it chose that transport.

3. **HIGH: Using raw keccak256 strings instead of SDK constants**
Manual computation of role hashes (e.g., `keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))`) risks typos that produce valid but incorrect role hashes. Always use the precomputed constants exported by the SDK.
*   **Wrong**: `const role = keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))`
*   **Correct**: `import { VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'`

4. **HIGH: Not extracting EAC address from receipt**
`spawnAccessControl` returns a transaction hash, not the contract address. You must use `extractAccessControlAddress` on the transaction receipt to get the address for subsequent configuration or for use in `spawnConduit`.

5. **HIGH: Assuming the deployment sequence grants every role you need**
The standard sequence grants `VEHICLE_STEAM_DEPOSIT` to three addresses per vehicle (multiVehicle, sectorAccountingEngine, subQueryEngine) when it is not already public on that vehicle's scope. If your security model needs a different hierarchy, build it with `buildGrantScopedRoleCall` / `buildSetScopedRolePublicCall` and your own scopes.

## References

- [Role to Scope Mapping](./references/role-reference.md)
- [Vehicle Deployment](../railnet-vehicle/SKILL.md)
- [Conduit Spawning](../railnet-conduit/SKILL.md)
