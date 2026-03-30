---
name: railnet-access-control
description: >
  Manage Railnet role-based access control — spawnAccessControl,
  grantScopedRole, revokeScopedRole, extractAccessControlAddress,
  role constants (VEHICLE_STEAM, MULTI_VEHICLE_DISPATCH,
  MULTI_VEHICLE_REBALANCE, MULTI_VEHICLE_SET_QUEUES, etc.),
  scope targeting rules. Load when setting up permissions, granting
  roles, or debugging MissingRole revert errors.
type: core
library: railnet-sdk
library_version: '0.0.0'
sources:
  - 'railnetorg/railnet-sdk:src/actions/accessControl/*.ts'
  - 'railnetorg/railnet-sdk:src/constants/roles.ts'
---

# Railnet Access Control

ExternalAccessControl (EAC) is the central permissioning system for Railnet. It uses scoped roles to grant specific permissions on specific contracts (scopes). This skill covers spawning EAC instances and managing granular role assignments.

## Setup

```typescript
import { createWalletClient, http, publicActions, type Hex, type Address } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { getAddresses } from 'railnet-sdk';

const account = privateKeyToAccount('0x...');
const client = createWalletClient({ account, chain: base, transport: http() })
  .extend(publicActions);
const addresses = getAddresses(base.id);
```

## Core Patterns

### 1. Spawning Access Control
Spawning a new EAC instance defines the initial admin and optional roles.

```typescript
import { spawnAccessControl, extractAccessControlAddress } from 'railnet-sdk';
import { VEHICLE_STEAM } from 'railnet-sdk';

const account = '0x...'; // Deployer

const hash = await spawnAccessControl(client, {
  factory: addresses.accessControlFactory,
  initialDefaultAdmin: account.address,
  initialDelay: 0,
  initialRoles: [
    { account: '0x...', role: VEHICLE_STEAM as Hex }
  ],
  account: account.address,
});

const receipt = await client.waitForTransactionReceipt({ hash });
const accessControlAddress = extractAccessControlAddress(receipt, addresses.accessControlFactory);
```

### 2. Granting Scoped Roles
Roles in Railnet are almost always "scoped" to a specific contract. Granting a role without the correct scope will result in `MissingRole` reverts during protocol operations.

```typescript
import { grantScopedRole, MULTI_VEHICLE_DISPATCH } from 'railnet-sdk';

const hash = await grantScopedRole(client, {
  accessControl: '0x...', // EAC address
  role: MULTI_VEHICLE_DISPATCH as Hex,
  scope: '0x...', // MUST be the SectorAccountingEngine address for this role
  grantee: '0x...', // Address receiving the permission
  account: '0x...', // Caller must have DEFAULT_ADMIN_ROLE
});
```

### 3. Revoking Scoped Roles
Revoking permissions follows the same scoped pattern.

```typescript
import { revokeScopedRole, VEHICLE_STEAM } from 'railnet-sdk';

await revokeScopedRole(client, {
  accessControl: '0x...',
  role: VEHICLE_STEAM as Hex,
  scope: '0x...', // Vehicle or Multi-Vehicle address
  grantee: '0x...',
  account: '0x...',
});
```

## Common Mistakes

1. **CRITICAL: Scoping role to wrong contract address**
Most Multi-Vehicle (MV) roles must be scoped to the `SectorAccountingEngine`, NOT the `MultiVehicle` contract itself. For example, `MULTI_VEHICLE_SET_QUEUES` must be scoped to the `QueueStrategyEngine`. Granting to the wrong scope succeeds silently but operations will revert with `MissingRole`.
*   **Wrong**: `grantScopedRole(..., { role: MULTI_VEHICLE_DISPATCH, scope: multiVehicleAddress, ... })`
*   **Correct**: `grantScopedRole(..., { role: MULTI_VEHICLE_DISPATCH, scope: sectorAccountingEngineAddress, ... })`

2. **HIGH: Using raw keccak256 strings instead of SDK constants**
Manual computation of role hashes (e.g., `keccak256(toHex('VEHICLE_STEAM'))`) risks typos that produce valid but incorrect role hashes. Always use the precomputed constants exported by the SDK.
*   **Wrong**: `const role = keccak256(toHex('VEHICLE_STEAM'))`
*   **Correct**: `import { VEHICLE_STEAM } from 'railnet-sdk'`

3. **MEDIUM: Role constants type mismatch**
SDK role constants are exported as strings, but `grantScopedRole` and `revokeScopedRole` expect the `Hex` type. You must cast them to avoid TypeScript errors.
*   **Wrong**: `{ role: VEHICLE_STEAM }`
*   **Correct**: `{ role: VEHICLE_STEAM as Hex }`

4. **HIGH: Not extracting EAC address from receipt**
`spawnAccessControl` returns a transaction hash, not the contract address. You must use `extractAccessControlAddress` on the transaction receipt to get the address for subsequent configuration or for use in `spawnConduit`.

5. **HIGH: Tension with `deployMultiVehicle` auto-grants**
The `deployMultiVehicle` workflow automatically grants a specific set of roles (like `VEHICLE_STEAM` to the public). If your security model requires custom role hierarchies or private steaming, you must avoid the workflow and use individual `grantScopedRole` calls with correct scopes.

## References

- [Role to Scope Mapping](./references/role-reference.md)
- [Vehicle Deployment](../railnet-vehicle/SKILL.md)
- [Conduit Spawning](../railnet-conduit/SKILL.md)
