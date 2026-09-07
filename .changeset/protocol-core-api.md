---
'@railnetorg/railnet-sdk': minor
---

The SDK builds Railnet calls and tells you what they will create. Sending them is yours, in React
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
conduit's vehicle and returns `{ call, query, queryId, vehicle }`, so the id is known *before* the
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
result. Pass `blockNumber` to read a past position.

**Removed — `PreparedWrite` and `ContractCallOptions`.** The first was exported and documented as
every builder's return type while nothing returned it. The second had one caller left; transaction
overrides belong to whatever sends the call.

`minOutput` is unchanged but now documented against the contract: the floor is enforced at the
vehicle's output and ignores conduit fees, so derive it from `estimateVehicle` and `applySlippage`,
never from `estimateConduit` — a floor taken from the conduit's estimate never fires, and it does
not bound the conduit shares received either.

The read actions, the query layer and the `railnetActions` decorator are untouched.
