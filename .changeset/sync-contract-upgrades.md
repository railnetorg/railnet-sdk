---
"@railnetorg/railnet-sdk": minor
---

Sync ABIs and actions with the latest contract upgrades, and add `prepare*` builders.

Add a `prepare*` counterpart for every write action (`prepareGrantScopedRole`, `prepareRevokeScopedRole`, `prepareSetScopedRolePublic`, `prepareSpawnAccessControl`, `prepareSpawnConduit`, `prepareEnableConduit`, `prepareFinalizeConduitDeposit`, `prepareProcessConduitQuery`, `prepareDepositConduit`, `prepareRedeemConduit`, `prepareAuthorizeVehicle`, `prepareSetQueues`, `prepareSpawnMultiVehicle`, `prepareSpawnAaveV3Vehicle`). Each is synchronous and returns a `PreparedWrite` (`{ address, abi, functionName, args }`) to spread into viem's `writeContract`/`simulateContract` or an app-side step engine. The existing execute actions are unchanged and now build on their `prepare*`. `prepareDepositConduit`/`prepareRedeemConduit` take `account` (with `receiver` defaulting to it) and emit only the Railnet call (no ERC20 approval — sequence it yourself). Builders that generate a salt derive it from the current timestamp unless you pass one, so pass salts explicitly when a prepared call has to match a predicted address or survive a retry.

`PreparedWrite` and `ContractCallOptions` are now exported from the package root.

Contract upgrade sync:

- Rename `VehicleRegistry` to `VehicleManager`: `vehicleRegistryAbi` → `vehicleManagerAbi`, `authorizeVehicle` parameter `vehicleRegistry` → `vehicleManager`, and the `vehicleRegistry` field on multi-vehicle salts / extracted contracts → `vehicleManager`.
- `spawnConduit` / `predictConduitDeployment`: drop `depositAsset`, `initialDepositSize`, and the `transferMode`/`TransferMode` enum; add `transferEnabled: boolean` and optional `initialInterceptions`.
- `spawnMultiVehicle`: drop `initialDepositSize` and `initialExpectedSupply`; add required `queryRegistry` and optional `forbiddenAddresses`.
- `spawnAaveV3Vehicle`: drop `initialDepositSize`; add required `queryRegistry` and optional `forbiddenAddresses`.
- `deployMultiVehicle`: drop `initialExpectedSupply` and `initialDepositAmount`; add optional `queryRegistry` (defaults to the chain's) and optional `forbiddenAddresses`. The factory approval is now sized by `getInitialDepositAmount` instead of a caller-supplied amount.
- Add `getInitialDepositAmount` (AssetRegistry read) and `assetRegistryAbi`. The factories no longer take an initial deposit size — they pull `AssetRegistry.getInitialDepositAmount(asset)` from the caller, so `spawnConduit` / `spawnMultiVehicle` / `spawnAaveV3Vehicle` require an approval to the factory for at least that amount.
- `getAddresses`: rotate every Base address to the current deployment (the previous set predates the contract upgrade); add `assetRegistry` and `queryRegistry`; drop `compoundV3VehicleFactory` and `aaveV3Vehicle`, which no longer exist in the deployment.
- Resync the role constants with `Roles.sol` (19 → 35). `VEHICLE_STEAM` is split into `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM`; `MULTI_VEHICLE_MOVE_ASSETS` and `MULTI_VEHICLE_MOVE_SHARES` are merged into `MULTI_VEHICLE_MOVE`; `MULTI_VEHICLE_REBALANCE` and `FEE_MANAGER_REDEEM_VEHICLE_SHARES` are removed, the underlying functions no longer exist. Adds the factory, asset registry, beacon, conduit, job listing, keeper, and module manager roles that were missing.
- `deployMultiVehicle` granted the removed `VEHICLE_STEAM` hash, which authorized nothing: sub-vehicle dispatches would revert on the role check. It now grants `VEHICLE_STEAM_DEPOSIT` and `VEHICLE_STEAM_REDEEM`, each checked independently against `isScopedRolePublic`.
- Add `bun run roles:check` to diff the role constants against a local contracts checkout, mirroring `abis:check`.
- `ConduitState.WAITING` → `ConduitState.PAUSED` (value `2` is unchanged), matching the on-chain `State` enum.
- `depositConduit` now binds the query salt to the sender: `query.salt` is derived as `keccak256(abi.encode(account, sourceSalt))`, which `conduit.create()` requires. Deposits built with the previous encoding revert with `InvalidQuerySalt`.
