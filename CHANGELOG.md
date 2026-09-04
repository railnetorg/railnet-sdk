# @railnetorg/railnet-sdk

## 0.5.0

### Minor Changes

- 75fd995: Make the React layer chain-aware, and stop it hashing keys it cannot hash.

  **Breaking.** The four query-key builders take the chain first:
  `conduitPositionQueryKey(chainId, parameters)`.
  - **Read hooks take `chainId`.** They called `usePublicClient()` bare, so they read the wallet's
    chain rather than the contract's: a page showing a Base conduit to a wallet on Ethereum read the
    wrong chain. A wagmi config holds every chain's transport, so this needs nothing from the user.
  - **`useEstimateConduit` and `usePredictConduitDeployment` threw on every call.** Their parameters
    carry a `bigint`, and TanStack hashes keys with `JSON.stringify`. Bigints are now stringified.
    Casing is untouched: a conduit `name` changes the CREATE2 address a prediction returns.
  - **Keys carry the chain, derived from `client.chain?.id`,** so a key cannot name a chain other
    than the one that filled it.
  - **Write actions take viem's `chain`.** Unset, it defaulted to `client.chain`, so
    `assertCurrentChain` compared the wallet's chain to itself. Declaring it makes viem check the
    wallet's live `eth_chainId` — for a `json-rpc` account; a local account signs for the declared
    chain and the node rejects a mismatch.
  - **`skipToken` replaces the throws inside `queryFn`,** so the exported `*QueryOptions` work
    outside their hook.
  - **Read hooks return their `queryKey`,** and each query exports its prefix
    (`conduitPositionQueryPrefix`), for invalidating without rebuilding a key.

- e0ba699: Let a deposit set a slippage floor, which only the redeem side could.

  `prepareRedeemConduit` has always taken `outputAsset: { asset, value }`, whose value is the floor.
  `prepareDepositConduit` hardcoded `value: 0n`, and `BaseVehicle._validateConstraints` rejects only
  when `query.output.value > estimate` — so zero rejects nothing and every deposit accepted whatever
  the vehicle produced.
  - `prepareDepositConduit` takes `minOutput?: bigint`. Omitted keeps today's behaviour.
  - `depositConduit` also takes `slippageBps?: number` and derives the floor itself. The pure builder
    cannot read the chain, so it takes an absolute bound; the action already reads, so it accepts a
    relative one. `PrepareDepositConduitParameters` omits `slippageBps` to keep that split explicit.
  - Adds `estimateVehicle` and `baseVehicleAbi`, transcribed from the `IBaseVehicle` interface.
    A deposit floor is measured against the vehicle's own output, not `estimateConduit`'s, which is
    net of the conduit's fees — so the floor was not computable from what the SDK exposed.
  - Adds `applySlippage(estimate, bps)`.

  Two limits the floor does not cover, both documented by the contracts. It is checked at create time
  against the create-time estimate — `MultiVehicle` adds a post-mint re-check precisely because
  "the create-time check alone is not end-to-end slippage protection on this path". And it bounds the
  vehicle's output only: per `Conduit.createRedeemFromConduitShares`'s natspec it "ignores the
  Conduit's own fees and share-exchange rate, so it does not bound the asset the receiver ultimately
  gets".

## 0.4.0

### Minor Changes

- a004958: Add prepareDepositConduitQuery, and refresh docs and skills

## 0.3.2

### Patch Changes

- 077875b: Raise the `viem` peer floor to `>=2.8.0`. Earlier 2.x releases do not export `StateOverride`, so the previous `>=2.0.0` allowed installs that could not build.

## 0.3.1

### Patch Changes

- bb42484: Point the skills' `library_version` metadata at 0.3.0. It still declared 0.1.0, which is what `intent stale` was flagging after each release. Metadata only — no skill content changed.

## 0.3.0

### Minor Changes

- a8367be: Make every salt an explicit parameter, and export a role registry.

  **Breaking.** `querySalt`, `deploymentSalt` and `salts` are now required on the four `spawn*` actions and their builders, on `deployMultiVehicle`, and `salt` is required on `prepareDepositConduit` / `prepareRedeemConduit`.
  - **A `prepare*` is now a pure function of its inputs.** Nothing is drawn from the clock, so two calls with the same parameters encode the same calldata — which is what makes a prepared call comparable against a simulation and replayable after a failure.
  - **`prepareSpawnMultiVehicle` derived seven deployment salts from one `Date.now()`.** A spawn that failed midway lost the timestamp, so the caller could not re-derive the salts and could never retry against the same seven addresses. A deployment salt fixes an address permanently; the caller has to own it.
  - **`depositConduit` and `redeemConduit` keep a default**, because a query salt is disposable and the action makes the full round trip itself — but it now comes from `crypto.getRandomValues`, not the clock. Two deposits from the same account in the same millisecond previously shared a `sourceSalt`, so the second reverted. Harmless for a human signing one at a time, reachable by a script or a batch.
  - **Salts no longer interpolate `name` or `symbol`.** `conduit-deploy-${symbol}-${now}` made a salt look deterministic when the timestamp silently broke that; a caller could reasonably expect the same symbol to redeploy to the same address.

  Adds `randomSalt()` for generating them.

  Adds `ROLES` (`readonly { name: string; hash: Hex }[]`) and `roleName(hash)`, so consumers labelling a role hash or building a role picker no longer reconstruct the list by introspecting the exports. A test asserts the registry stays in step with the named constants in both directions.

  None of the above was a vulnerability: the contracts mix `msg.sender` into every salt — `Conduit.sol` for queries, `CoreFactory._computePermissionedSalt` for deployments — so a predictable salt let nobody front-run an address or occupy another account's queryId. These were operability and determinism defects.

## 0.2.0

### Minor Changes

- f6fa146: Rotate every protocol address onto the audited deployment generation, and add Ethereum (`1`) alongside Base (`8453`).

  All 15 protocol addresses pointed at a superseded generation while the ABIs had already been resynced from the audit-remediation branch, so the two halves of the SDK spoke to different deployments:
  - **`spawnConduit` could not work.** The `spawn` selector our ABI encodes (`0x9d0c036e`) is absent from the factory we shipped and present in the audited one.
  - **`getInitialDepositAmount` under-reported.** The registry we shipped returns `1000000` for USDC where the audited one requires `2000000`, so a caller would approve half of what the factory pulls and the spawn would revert.
  - A conduit spawned by the old factory sits on a beacon whose `estimate`/`convert` still take `Asset[]`, which the scalar ABI cannot call.

  No test caught this because none of them touched a factory address. `addresses.test.ts` now asserts on-chain that the conduit factory we ship acknowledges the fixture the scalar ABI is proven against — swapping the old address back fails it.

  Each chain's block is transcribed from the deployment manifest.

  Ethereum's deployment authorizes no assets yet, so `getInitialDepositAmount` reverts there and spawning will too. The addresses are correct; the chain is not provisioned.

- c42f14a: Add the SectorAccountingEngine primitives an asset manager needs to reallocate, now that the contracts replaced `rebalance()` with a composable `move` + `dispatch` API.
  - The `Sector` type with the five static sector constants (`SECTOR_AVAILABLE`, `SECTOR_ALLOCATION`, `SECTOR_RESERVED`, `SECTOR_ENTRY`, `SECTOR_EXIT`) and the `vehicleSector` / `sectorToVehicle` / `isVehicleSector` helpers. A vehicle sector is `0x01` followed by eleven zero bytes and the address; the static ones are ASCII right-aligned in a `bytes32`. Neither is reproducible by hand from an ABI.
  - `moveBetweenSectors` for `SectorAccountingEngine.move` and `dispatchVehicle` for its `dispatch`, each with a `prepare*` builder.
  - `simulateDispatchVehicle`, which sends nothing and returns the query plus the state the dispatch would reach — the only exact way to know whether a leg settles in one transaction or leaves an async vehicle in `PROCESSING`.
  - `prepareDispatchVehicle` rejects `minOutput` combined with an `amount` of `maxUint256` up front, which the engine rejects as `MinOutputRequiresPinnedAmount`.
  - Export the shared `Query` type, previously inlined in `processConduitQuery`.

- bec2486: `getConduitInfo` now returns `isEnabled`, read from `conduit.ready()` in the same multicall. The field was documented on the `ConduitInfo` type but never returned, so callers had no way to tell a live conduit from a disabled one — and `ready()` is the gate that decides whether deposits and redeems are possible at all.
- 415e46f: Deposits and redeems name a valid output asset, so they stop reverting. `BaseVehicle._validateOutput` reverts unless a DEPOSIT names the vehicle as its output asset and a REDEEM names the underlying, and the SDK passed the zero address for both.

  `depositConduit` now reads `conduit.getVehicle()` (skipped when you pass `vehicle`) and `redeemConduit` reads `conduit.asset()` (skipped when you pass `outputAsset`), both alongside the allowance read they already did. The pure builders cannot derive either address, so `prepareDepositConduit` requires `vehicle` and `prepareRedeemConduit` requires `outputAsset`.

- 8a17f99: Resync all ten ABIs from the audited contracts (the audit-remediation branch), which supersedes the hand-scalarised subset and brings the rest of that branch with it.
  - **`conduitFactory.spawn` takes one argument, not two.** `deploymentSalt` is a field of `SpawnParams`; the SDK also passed it positionally, which produced a different selector and made conduit deployment impossible. `prepareSpawnConduit` now sends `[spawnParams]`.
  - `vehicleManager`: the `Route` struct in `IncompatibleVehicle` was `(address[], address[])[]` instead of `(address, address)[]`, so that revert decoded as an unknown error.
  - Adds the errors the SDK could not decode: `ZeroInputValue`, `InvalidInput`, `UnknownQuery`, `InterceptionSharesTooHigh`, and renames `InvalidEstimatedAssets` to `InvalidEstimatedAsset`.
  - Adds `SectorAccountingEngine.activeVehicles`, and `VEHICLE_PROCESS_QUEUE` to the role constants (36 roles).
  - The three factory `spawn` entrypoints are `nonpayable`, so they can no longer trap ETH.

- 84b59cc: Sync ABIs and actions with the latest contract upgrades, and add `prepare*` builders.

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
  - `ConduitState.WAITING` → `ConduitState.PAUSED` (value `2` is unchanged), matching the on-chain `State` enum.
  - `depositConduit` now binds the query salt to the sender: `query.salt` is derived as `keccak256(abi.encode(account, sourceSalt))`, which `conduit.create()` requires. Deposits built with the previous encoding revert with `InvalidQuerySalt`.

### Patch Changes

- 8f2ef8f: Docs: correct the five call sites and four prose lines that showed write actions taking two clients. Every action takes `(client, parameters, options?)` — a single client that simulates and signs — as the skills already stated and the code always did.
- dbd6c08: `redeemConduit` no longer sends an approval transaction. The conduit burns the caller's shares with an internal `_transfer` followed by `_burn`, which never consults an allowance, so the approval was always a wasted transaction and a wasted signature. Redeeming is now a single transaction.

## 0.1.0

### Minor Changes

- c06a457: Initial Release
- c0948ea: Initial release
