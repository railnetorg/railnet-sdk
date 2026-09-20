# @railnetorg/railnet-sdk

## 0.8.0

### Minor Changes

- 621f886: Added `getAccountListStatus`, which returns every verdict an AccountList holds on one account in a
  single multicall ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - The three raw flags come back alongside the verdicts, because which one is false decides whether
    to unblock, to allow-list, or to do nothing on a sanctions hit.
  - `canRedeem` passes for a blocked holder: sanctions alone gate an exit.
  - On `railnetActions`.

- cd1da36: Added AccountList, the compliance module a conduit takes at spawn — `buildSpawnAccountListCall`,
  `predictAccountListDeployment`, and the manager calls for the mode, both lists and sanctions
  screening ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - Precedence runs backwards from most allow-list systems: sanctions beat the block-list, which
    beats the allow-list.
  - Redeem consults sanctions alone, so a blocked holder can still take its own money out.
  - Screening fails closed: an oracle that reverts or has no code marks everyone sanctioned, and a
    sanctioned account cannot exit.
  - Fixed on the conduit at spawn, with no setter afterwards.

- cd1da36: **Breaking:** Changed the call builders to throw on input the contracts reject, rather than encode
  a call that reverts on chain ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - A fee split that is empty, out of order, or short of 10000 bps.
  - A rate above its ceiling. `depositFeeBps` and `redeemFeeBps` cap at 9999, not 10000.
  - `sanctionsEnabled` set without an oracle.
  - An empty batch, a zero address or a duplicate, adding to or removing from either account list.
  - `initialFees` above the matching `initialMaxFees` at spawn.

- cd1da36: Added `buildEnableConduitTransfersCall`, which builds `conduit.enableTransfers()`, and deprecated
  `buildEnableConduitCall` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

  ```diff
  - const call = buildEnableConduitCall({ conduit })
  + const call = buildEnableConduitTransfersCall({ conduit })
  ```

  - Not a rename. `buildEnableConduitCall` builds `conduit.enable()`, a different selector that
    accepts the ConduitFactory alone and reverts `InvalidCaller` for anyone else — it calls it once
    the seed deposit settles.
  - Take the migration above only if that revert is what you were getting. `enableTransfers()` is a
    one-way latch on holder transfers, and no call turns it back off.
  - `buildEnableConduitCall` is removed in 0.9.0.

- cd1da36: Added `assertFeeRecipients` and `assertFees`, which validate a fee split and a rate set before a
  call is built ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - Exported so a form can check a draft split before a call is assembled.
  - A recipient's `target` must be non-zero, its `shareBps` positive, and the list must total exactly 10000.
  - Addresses are compared lowercased: the contract orders recipients as `uint160`, so a checksummed
    address would otherwise sort by case.

- 621f886: Added `buildForceRedeemCall`, which burns a blocked or sanctioned holder's shares and opens a redeem
  query paid to them, without their signature ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - It does not complete the exit. Against an async vehicle the query is still `PROCESSING` when the
    transaction lands — read the id with `extractQueryIds` and settle it with
    `buildProcessConduitQueryCall`.
  - The account list gates both sides: the holder must be sanctioned or block-listed, and the caller
    needs CONDUIT_FORCE_REDEEM. A clean holder cannot be ejected whatever the caller holds.
  - The proceeds go to the holder, never to the caller.

- 621f886: Added the unscoped half of the ExternalAccessControl role surface ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - `buildGrantRoleCall` and `buildRevokeRoleCall` apply to every scope. Prefer the scoped builder,
    which confines a role to the contract performing the gated call.
  - `buildRenounceRoleCall` gives up a role the caller holds. `DEFAULT_ADMIN_ROLE` is refused.
  - `buildSetRolePublicCall` takes `DEFAULT_ADMIN_ROLE` only, unlike its scoped variant, which takes
    the role's own admin.
  - Pass a base role, never one already encoded against a scope: the contract cannot tell them apart
    and would grant the encoded value under the global admin.

- 621f886: Added `buildSetConduitInterceptionsCall` and `buildSetVehicleInterceptionsCall`, which rewrite
  reward routing after deployment ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). Interceptions were settable at spawn and never again.
  - `assertInterceptions` checks an entry's shares against the 10000 bps ceiling before the call is
    assembled. It is a ceiling, not an exact total as a fee split requires, so a shortfall is legal.
  - The ceiling is per entry, not across assets.
  - The rules are read by off-chain distribution, so a wrong list misroutes a reward without
    reverting.

- 621f886: Added `getIsTransferable`, which asks a conduit whether it would let one address send shares to
  another ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - It takes a pair: the same conduit is transferable for one pair and not another.
  - The same predicate gates wrapping a query in the OwnerRegistry.
  - On `railnetActions`.

- cd1da36: Added OwnerRegistry, which records who owns a conduit's live queries — `buildSpawnOwnerRegistryCall`
  and `predictOwnerRegistryDeployment` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - An owner can wrap the claim into a transferable ERC-721.
  - It carries no access control of its own; the caller needs FACTORY_SPAWN on the factory's.
  - Fixed on the conduit at spawn, with no setter afterwards, as AccountList is.

- d8c4eaa: Added `buildProgressQueryCall`, which advances a dispatch that did not settle in its own transaction
  ([#55](https://github.com/railnetorg/railnet-sdk/pull/55)).
  - The engine keys a sub-query on a hash of its four fields, so a struct assembled by hand reverts
    `UnknownSubQuery` for one wrong byte. The builder takes the dispatch parameters and derives the
    rest.
  - One call can chain several transitions, so the state it reaches is not necessarily the next one.
  - `toSubQuery` is exported for the struct alone.
  - Ships the `SubQueryEngine` ABI, generated from the hangar artifacts.

- cd1da36: Renamed the two conduit-scoped protocol enums to the query-scoped names the contracts use, and
  deprecated the old names ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

  ```diff
  - import { ConduitMode, ConduitState } from '@railnetorg/railnet-sdk'
  + import { QueryMode, QueryState } from '@railnetorg/railnet-sdk'
  ```

  - Neither was conduit-specific: vehicles, the sector accounting engine and the estimators all read
    the same values.
  - `ConduitMode` and `ConduitState` still resolve, with identical members, and are removed in 0.9.0.

- cd1da36: Added the remaining twelve read actions to the `railnetActions` decorator, which held four ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
- cd1da36: Added `buildRebalanceRedeemCall`, which redeems a position out of one sub-vehicle and stages the
  proceeds in another's sector as a single `multicall` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - A rebalance is two transactions. Deposit the staged proceeds with `buildDispatchVehicleCall`,
    settling into `SECTOR_ALLOCATION`.
  - Thread one `operationId` through both, so the events stitch back into a single rebalance.
  - `shares` is the exact amount redeemed, in the source vehicle's share units. The dispatch reverts
    `DispatchRedeemAmountTooHigh` rather than redeeming whatever else the sector happens to hold.
  - `minOutput` is an optional floor on the proceeds, off by default.

- 621f886: Added `buildFeedQueryRedeemQueueCall` and `buildRetrieveQueryRedeemQueueAssetsCall`, the two
  operator overrides on a MultiVehicle's redeem queue ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - `buildFeedQueryRedeemQueueCall` skips the `minSharesForAutoFulfill` threshold auto-fulfillment has
    to cross, so a queue below that floor can still be served.
  - `buildRetrieveQueryRedeemQueueAssetsCall` deposits without minting, which raises the per-share
    rate for every holder.

- cd1da36: Added `getRailnetError`, which reads a revert out of whatever viem threw and returns its decoded
  name, arguments and a hint, or `null` when the failure was not a contract revert ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

  ```ts
  const reverted = getRailnetError(error);
  if (reverted?.name === "InsufficientAllowance") return approveFirst();
  ```

  - `railnetErrorHints` is the hint table itself, keyed by error name.
  - `protocolErrorsAbi` is the fallback fragment it decodes against. viem decodes a revert using the
    ABI of the call, so an error the called contract does not itself declare arrives as raw bytes.
  - Six such errors now decode, `InvalidOutput` and `InvalidEstimation` among them. Both are reverted
    from `ErrorLib` through assembly, which solc lists on no contract at all.
  - A hint names the contract that raises the error. `InsufficientAllowance` comes from a factory
    pulling its initial deposit, not from a conduit; a conduit deposit short on allowance reverts
    with the token's own ERC-20 error.

- c0ea160: Added the 167 error names the protocol declares to `protocolErrorsAbi` ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)). viem decodes a
  revert against the ABI of the call, so an error raised by another contract in the same transaction
  arrives as raw bytes.
  - `buildSpawnConduitCall` reaches `AssetNotAuthorized`, raised by the AssetRegistry.
  - `buildSpawnAaveV3VehicleCall` reaches the reserve checks its facet runs at initialization.
  - `estimateVehicle` reaches both reverts `BaseVehicle.estimate` raises; `baseVehicleAbi` declares
    no errors of its own.
  - 169 entries for 167 names: two exist in two signatures. Selectors are unique across the set, so
    the fallback cannot mis-attribute a revert.

- c0ea160: Added `CreateNotAllowed` and `DefaultAdminCannotBePublic` to `railnetErrorHints`, and pointed four
  entries at the condition they describe ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)).
  - `DisabledVehicle` is the vehicle's own `enabled` flag, not the beacon; a paused beacon raises
    `EnforcedPause`.
  - `PublicRoleAuthDenied` fires when a scoped role is public, refusing per-account grants.
  - `NotAllowed` screens a third-party receiver; the sender being refused is `CreateNotAllowed`.
  - `InvalidPoolAddressesProvider` checks for a zero address or no code, nothing else.

- 621f886: Added `getSectorBalance`, which reads what one accounting sector holds of one asset ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)).
  - `buildRebalanceRedeemCall` settles into the destination vehicle's sector, and on an asynchronous
    source that lands only once the query progresses. Poll here before dispatching the deposit that
    follows.
  - A share sector is read with the sub-vehicle's own address as `asset`.
  - On `railnetActions`.

- 93200b1: **Breaking:** Keyed `railnetErrorHints` by `ProtocolErrorName`, the union of every custom error the shipped ABIs declare. Indexing it with an arbitrary `string` no longer compiles.
  - `getRailnetError` resolves the hint itself and is unaffected.
  - So are `Object.entries(railnetErrorHints)` and static access like `railnetErrorHints.MissingRole`.
  - `ProtocolErrorName` is exported, for narrowing a name yourself.

  ```diff
  - const hint = railnetErrorHints[errorName]
  + const hint = getRailnetError(error)?.hint
  ```

- cd1da36: Added the three remaining vehicle factories, each with the receipt helper that reads its deployed
  address back ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)). Only Aave V3 had one.
  - `buildSpawnErc4626VehicleCall` and `buildSpawnMorphoBlueVehicleCall` derive the asset from their
    target rather than taking one, so neither can be handed an asset the vault or market disagrees
    with.
  - `buildSpawnWrapperVehicleCall` takes no `initialExpectedSupply`. It still pulls a seed deposit,
    but enforces no floor on the shares minted.
  - Added `getMorphoBlueSingleton`: `spawn` reverts on any `morpho` other than the factory
    implementation's own, so it is read rather than hardcoded.
  - Added `getMorphoMarketAsset`. The market's loan token is what a supplier deposits, and so is the
    vehicle's asset.

- d8c4eaa: Added `buildWrapQueryCall` and `getQueryClaim`, which mint an ERC-721 over a live conduit query and
  read who holds the claim ([#55](https://github.com/railnetorg/railnet-sdk/pull/55)).
  - Wrapping needs the caller to be the registered owner, the query to be live, and the conduit to
    allow the caller a transfer to itself.
  - `wrap` clears the owner and sets a token id, so a zero owner means the token holder owns the
    claim or the registry never knew the query, depending on the flag. `getQueryClaim` reads all three
    at once.
  - `unwrap` is keyed on `msg.sender` as the conduit namespace, so only the owning conduit can call
    it. There is no builder.
  - Ships the `OwnerRegistry` ABI, generated from the hangar artifacts.

### Patch Changes

- 999562f: Fixed twelve documentation pages listing `account` as a call-builder parameter ([#52](https://github.com/railnetorg/railnet-sdk/pull/52)). Builders take
  no account; it goes to `simulateContract`.

  ```diff
  - buildProcessConduitQueryCall({ conduit, account, query })
  + simulateContract(client, { ...buildProcessConduitQueryCall({ conduit, query }), account })
  ```

- 1b13f94: Fixed two entries in the bundled conduit error reference that named the wrong contract ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).
  - `InsufficientAllowance` is raised by the factories pulling a spawn's initial deposit. A conduit
    deposit short on allowance reverts with the token's own ERC-20 error instead.
  - `VehicleNotAuthorized` comes from the multi vehicle's VehicleManager, not from a factory.
    `buildAuthorizeVehicleCall` is the fix.

- cd1da36: Fixed `predictConduitDeployment` returning an address the matching spawn would not deploy to
  ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)). It built its own `SpawnParams` tuple, so any field the two mapped differently moved the
  CREATE2 result; both now share one mapping.
- 999562f: Fixed nine documented claims the contracts contradict, four of which broke a transaction for anyone
  following them ([#52](https://github.com/railnetorg/railnet-sdk/pull/52)).
  - `getInitialDepositAmount` named three of the seven factories that pull the deposit, and a `0n`
    return the read cannot produce: an unauthorized asset reverts `AssetNotAuthorized`.
  - `buildSpawnConduitCall` documented no role. It needs CONDUIT_SPAWN, not the FACTORY_SPAWN every
    other spawn builder names.
  - `buildSetQueuesCall` documented no validation against eight on-chain checks, one rejecting the
    `2n ** 256n - 1n` the SDK teaches as unlimited elsewhere.
  - The three scoped-role builders required the default admin; the contract takes the role's own
    admin, held globally or scoped to the same scope.
  - `predictFeeManagerDeployment` said only `deploymentSalt` moved the address. Every factory folds
    its whole initializer into the init code the CREATE2 hashes.

## 0.7.0

### Minor Changes

- 7429d28: Add the FeeManager, a scoped role check, and the multi vehicle's operations.

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

## 0.6.0

### Minor Changes

- 4fc0cf5: Split the address book into a production entry point and a staging one, and resync both onto the
  protocol's `v1.0.0` deployment.

  **Breaking — the addresses moved.** `v1.0.0` shipped on 2026-09-01 and rotated every protocol
  address. The shipped table still held the previous generation, so the SDK was encoding
  calls to superseded factories. Both entry points now come from that deployment.

  **Breaking — `getAddresses(8453)` throws.** The root holds **production** deployments only, and
  Base has none yet: what it runs today is a staging deployment. Answering with it would hand a
  partner staging under the name of production.

  **New — `@railnetorg/railnet-sdk/staging`.** Railnet runs staging on real mainnet chain ids rather
  than on a testnet, so a chain id cannot say which environment you are on. The import path says it
  instead: the same `getAddresses` and `isSupportedChain` over the staging tables, which hold Base
  `8453` and Ethereum `1`. Each entry point has one deployment per chain, so `getAddresses(chainId)`
  is unambiguous within either, and importing the root cannot reach a staging address by accident.

  When Base's production deployment ships it lands in the root, and nothing else changes.

  **New — `startedAtBlock`** on every deployment: the block an indexer or a log scan should begin at.

  `ChainAddresses.wrapperVehicleFactory` is now optional — the Ethereum production deployment ships
  no wrapper vehicle.

- 4fc0cf5: The SDK builds Railnet calls and tells you what they will create. Sending them is yours, in React
  too.

  **Breaking — every write hook is removed.** `useDepositConduit`, `useRedeemConduit`,
  `useSpawnConduit`, `useEnableConduit`, `useFinalizeConduitDeposit`, `useProcessConduitQuery`,
  `useApproveConduitDeposit`, `useSpawnMultiVehicle`, `useAuthorizeVehicle`, `useSetQueues`,
  `useGrantScopedRole`, `useRevokeScopedRole`, `useSetScopedRolePublic`, `useSpawnAccessControl` and
  `useSpawnAaveV3Vehicle` are gone, and so is the `simulateThenWrite` helper behind them. Fifteen of
  them were one 30-line template with the builder name changed, wrapping the two hooks wagmi already
  ships:

  ```tsx
  - const { mutate } = useEnableConduit()
  - mutate({ conduit, account })
  + const { data: simulation } = useSimulateContract(buildEnableConduitCall({ conduit }))
  + const { writeContract } = useWriteContract()
  + writeContract(simulation.request)
  ```

  wagmi's own split already simulates on the app's transport and signs on the connector, which is the
  whole reason the hooks existed. Going through it restores what re-implementing it cost: the
  connector's chain switching, the account it already knows, and argument types the helper erased
  with two `as never` casts.

  **Breaking — `prepare*` is now `build*Call`.** `prepareDepositConduit` becomes
  `buildDepositConduitCall`, and so on for all sixteen. `prepare*` is viem's name for something else:
  `prepareTransactionRequest` is async, takes a client and fills nonce and fees. These are pure and
  synchronous.

  **Breaking — deposits and redeems take `sender`, not `account`.** It is the address that will send
  the transaction, and `conduit.create()` binds the query salt to it. Through a Safe, an EIP-5792
  batch or a relayer that is the smart account, not the user — a call built for the connected EOA
  reverts with `InvalidQuerySalt`. The old name invited passing `useAccount().address` everywhere,
  which is right only when nothing sits between the user and the conduit.

  **New — the identity of the query, at the source.** A conduit operation creates a query, and the id
  it is created under is `keccak256(abi.encode(chainId, vehicle, query))` — the value `QueryCreated`
  carries, and the key an indexer holds. `getDepositConduitCall(client, parameters)` resolves the
  conduit's vehicle and returns `{ call, query, queryId, vehicle }`, so the id is known _before_ the
  transaction is sent. `getRedeemConduitCall` returns `{ call, querySalt, outputAsset }`: a redeem's
  query is assembled on chain at the share ratio of the including block, so its id is only knowable
  once it lands — `extractQueryIds(receipt, conduit)` reads it back. `toQueryId` and `toQuerySalt` are
  exported for both.

  `useDepositConduit` used to generate the salt inside its mutation and return only a hash, which
  destroyed the join key at the source. Salts are required everywhere now, as they already were in
  the builders.

  **New — `toCall`.** Rewrites a built call for `sendCalls` (EIP-5792), which names the target `to`
  rather than `address`. Batching the approval with the deposit is one confirmation on a wallet that
  supports it — check its capabilities, and build the call for the address that will end up as
  `msg.sender`.

  **New — `useDepositConduitCall` and `useRedeemConduitCall`**, with
  `depositConduitCallQueryOptions` and `redeemConduitCallQueryOptions`. Read hooks: they resolve the
  call and its query identity, and send nothing.

  **Fixed — the receipt helpers decoded the wrong events.** They passed `eventName` to viem's
  `decodeEventLog`, which selects the ABI item by `topic0` and ignores that argument, so any log from
  the same emitter that happened to decode was accepted. `extractConduitAddress` and its siblings
  could return `undefined` typed as `Address`. They use `parseEventLogs` now.

  **Fixed — `getConduitPosition` read two blocks.** `convert` takes the balance `balanceOf` returned,
  so the two reads cannot be batched; they are pinned to one block instead, and the block is on the
  result. The pin resolves the block with `cacheTime: 0` — viem caches the block number for the
  client's `cacheTime` by default, which would pin to a block up to a polling interval old and make a
  position read taken right after a receipt miss the deposit that receipt confirmed. Pass
  `blockNumber` to read a past position; `conduitPositionQueryOptions` and `useConduitPosition` pass
  it through.

  **Removed — `PreparedWrite` and `ContractCallOptions`.** The first was exported and documented as
  every builder's return type while nothing returned it. The second had one caller left; transaction
  overrides belong to whatever sends the call.

  `minOutput` is unchanged but now documented against the contract, and the previous wording was
  wrong. The floor is compared against the vehicle's own estimate, in vehicle shares.
  `estimateConduit` prices the same deposit in _conduit_ shares — `Conduit._estimate` delegates to the
  vehicle, then converts the result through the conduit's share rate and deducts conduit fees. Those
  are different denominations, not a fee haircut: a floor derived from the conduit's estimate is
  looser or tighter than the one asked for depending on the share rate, and at some rates every
  deposit reverts. Derive it from `estimateVehicle` and `applySlippage`. It never bounds the conduit
  shares finally received either, so it is not a "minimum received".

  The read actions, the query layer and the `railnetActions` decorator are untouched.

- 4fc0cf5: The SDK ships builders and reads. Composing and sending the transactions is yours.

  **Breaking — the write actions are gone.** Sixteen of them were a builder wrapped in
  `simulateContract` then `writeContract`, and two also hid an ERC-20 approve and a `getVehicle` read.
  None of that is Railnet knowledge: the salt derivation, the rule that a deposit's output asset must
  name the vehicle, the encoding — that lives in the builders, and it stays.

  **Breaking — `deployMultiVehicle` and `useDeployMultiVehicle` are gone.** They hid eight or more
  transactions against several factories behind one call, so a caller could not report progress, retry
  a step, or see which one failed. What they carried is still shipped: the builders, the log parsers
  (`extractMultiVehicleContracts`, `extractAccessControlAddress`), and the order — which scope each
  role needs, why granting after authorizing fails — as a guide at `/workflows/deployingAMultiVehicle`
  and in the vehicle skill.

  **Breaking — a conduit deposit no longer approves on your behalf.** Approve first, or batch the
  approval with the deposit through EIP-5792.

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
