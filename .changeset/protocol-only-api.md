---
'@railnetorg/railnet-sdk': minor
---

The SDK builds Railnet calls; sending them is yours.

**Breaking — every write.** The write actions are removed. Build the call with its `prepare*`
builder and send it:

```ts
- await enableConduit(walletClient, { conduit, account })
+ const { request } = await simulateContract(client, { ...prepareEnableConduit({ conduit }), account })
+ await writeContract(client, request)
```

The builders keep what is Railnet's: the salt derivation, the rule that a deposit's output asset
must name the vehicle, the encoding. Simulating and sending are two lines of viem.

`prepareDepositConduit` needs `vehicle` (from `conduit.getVehicle()`) and `prepareRedeemConduit`
needs `outputAsset` (from `conduit.asset()`) — the deleted actions read those for you. Both need a
`salt`; use `randomSalt()`.

**Breaking — deposits.** `useDepositConduit` no longer approves. Approve the conduit for the token yourself
first — it is a plain ERC-20 call. You get both hashes, and a rejected
deposit no longer leaves an approval you cannot see. `slippageBps` is gone: derive `minOutput` from
`useEstimateConduit`.

**Breaking — `useDeployMultiVehicle` and `deployMultiVehicle` are removed.** Deploying a
multi-vehicle is eight or more transactions against several factories, each needing an address the
previous one returned. Behind one call you could not report progress, retry a step, or see which
failed. The log parsers (`extractMultiVehicleContracts`, `extractAccessControlAddress`) are still
exported, and the order is documented at `/workflows/deployingAMultiVehicle`.

**Every write hook now simulates through your transport.** They handed the wallet client to an
action that simulated and signed with it, so every preflight reached the wallet's RPC — a wallet
answers reads from whatever node it picked, at whatever freshness it keeps. One was observed pinned
to a block from before an approval was sent, which reverted a valid deposit. The hooks now simulate
on `usePublicClient` and sign on `useWalletClient`, and each takes an optional `chainId` like the
read hooks. The preflight and its decoded revert reason are unchanged.

`ContractCallOptions` loses `chain`: it existed for the write actions, and a simulation does not
assert the wallet chain.

The read actions, the query layer and the `railnetActions` decorator are untouched.
