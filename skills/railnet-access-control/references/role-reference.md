# Railnet Role Reference

This reference provides the complete mapping of roles to their required scopes within the Railnet protocol. Granting a role to the wrong scope will result in `MissingRole` reverts during protocol operations.

## Role to Scope Mapping

| Role | Must be scoped to |
|------|-------------------|
| `VEHICLE_STEAM_DEPOSIT` | Vehicle or Multi-Vehicle contract |
| `VEHICLE_STEAM_REDEEM` | Vehicle or Multi-Vehicle contract |
| `MULTI_VEHICLE_DISPATCH` | `SectorAccountingEngine` |
| `MULTI_VEHICLE_MOVE` | `SectorAccountingEngine` |
| `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION` | `VehicleManager` |
| `MULTI_VEHICLE_DEPOSIT` | `SectorAccountingEngine` |
| `MULTI_VEHICLE_SET_THRESHOLDS` | `SectorAccountingEngine` |
| `MULTI_VEHICLE_SET_QUEUES` | `QueueStrategyEngine` |
| `MULTI_VEHICLE_PROGRESS_QUERY` | `SubQueryEngine` |
| `MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE` | Multi-Vehicle |
| `MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS` | Multi-Vehicle |
| `FEE_MANAGER_SET_FEES` | `FeeManager` |
| `FEE_MANAGER_SET_FEE_RECIPIENTS` | `FeeManager` |
| `FEE_MANAGER_DISPATCH_ERC20` | `FeeManager` |
| `VEHICLE_SET_INTERCEPTIONS` | Vehicle or Multi-Vehicle |
| `ACCOUNT_LIST_MANAGER` | `AccountList` |

## Role Constants

All role constants are precomputed as `keccak256(toHex('ROLE_NAME'))`. Use the constants exported from `@railnetorg/railnet-sdk` to avoid typos.

- `DEFAULT_ADMIN_ROLE` — `0x0000...0000` (not keccak256, hardcoded zero bytes32)
- `FACTORY_SPAWN`
- `FACTORY_DEPRECATE`
- `CONDUIT_SPAWN`
- `ASSET_REGISTRY_SET_ASSET`
- `BEACON_FREEZE`
- `BEACON_PAUSE`
- `BEACON_UNPAUSE`
- `BEACON_UPGRADE`
- `VEHICLE_STEAM_DEPOSIT`
- `VEHICLE_STEAM_REDEEM`
- `VEHICLE_SET_INTERCEPTIONS`
- `VEHICLE_ALLOW`
- `VEHICLE_EXEC`
- `CONDUIT_SET_INTERCEPTIONS`
- `FEE_MANAGER_SET_FEES`
- `FEE_MANAGER_SET_FEE_RECIPIENTS`
- `FEE_MANAGER_DISPATCH_ERC20`
- `MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE`
- `MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS`
- `MULTI_VEHICLE_SET_QUEUES`
- `MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION`
- `MULTI_VEHICLE_MOVE`
- `MULTI_VEHICLE_DEPOSIT`
- `MULTI_VEHICLE_DISPATCH`
- `MULTI_VEHICLE_PROGRESS_QUERY`
- `MULTI_VEHICLE_SET_THRESHOLDS`
- `JOB_LISTING_REGISTER`
- `JOB_LISTING_UNREGISTER`
- `JOB_LISTING_EXECUTE`
- `MODULE_MANAGER`
- `ACCOUNT_LIST_MANAGER`
- `CONDUIT_FORCE_REDEEM`
- `CONDUIT_SET_TRANSFER_ENABLED`
- `CONDUIT_PROCESS`
- `KEEPER_ON_REPORT`

## ExternalAccessControl Errors

Common errors thrown by the `ExternalAccessControl` contract:

- `MissingRole(role, scope, caller)`: The caller does not have the specified role for the given scope. This is the most common error and usually indicates an incorrect scope was used during the `grantScopedRole` call.
- `OnlyOwnerCanRenounce(account, role, scope)`: Only the account holding the role can renounce it.
- `DefaultAdminCannotBePublic()`: The `DEFAULT_ADMIN_ROLE` cannot be granted to the public (address zero).
- `CannotModifyPublicRole()`: Certain roles are restricted from being modified once set to public.
