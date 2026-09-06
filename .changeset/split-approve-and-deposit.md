---
'@railnetorg/railnet-sdk': minor
---

Split the conduit deposit into an approval and a deposit, and keep the deposit's reads off the
wallet.

**Breaking.** `useDepositConduit` no longer approves on your behalf. Approve first with the new
`useApproveConduitDeposit`, or send the approval yourself.

- **The deposit was two transactions behind one call.** No stepper was possible, the approval's
  hash never reached the caller, and a rejected deposit left an approval on chain the app did not
  know about. Nor could a caller reach for a permit or batch the pair. Two hooks give back the
  three lines of branching every ERC-20 flow already has, and both hashes with them.
- **The deposit's reads no longer go through the wallet.** A wallet's provider serves reads from
  whatever node it chooses, at whatever freshness it chooses: one was observed pinned to a block
  from before the approval was sent, so the deposit simulated against a spent allowance and
  reverted on state that was already on chain. `useDepositConduit` now reads
  `conduit.getVehicle()` through `usePublicClient` — the transport the app declared — and hands
  only the transaction to the wallet, which is how wagmi's own `simulateContract` and
  `waitForTransactionReceipt` treat the split.
- **`slippageBps` moves to the caller.** The hook no longer estimates, so derive `minOutput` from
  `useEstimateConduit` and pass it. `depositConduit` keeps `slippageBps` for callers who own their
  client, where a read is not a gamble on someone else's RPC.
- `vehicle` and `salt` are optional variables: the vehicle is read when omitted, the salt is
  random.

**Every write hook simulates through the app's transport.** They all handed the wallet client to
an action that simulates and writes with the one client it is given, so every preflight reached the
wallet's RPC. It matters most in the two-step flows an integration is made of — grant a role then
enable, deposit then finalize, spawn then authorize — where the state a call depends on changed
seconds earlier. The hooks now build with the `prepare*` builder, simulate on `usePublicClient` and
sign on `useWalletClient`, so the preflight and its decoded revert reason are kept. Each takes an
optional `chainId`, like the read hooks.

`useRedeemConduit` reads `conduit.asset()` through the public client too, and takes `outputAsset`
and `salt` as optional variables.

**`useDeployMultiVehicle` is removed.** It spawns several contracts and reads their addresses back
out of receipts across five steps, so it never had the shape of a call — and wrapped that way it
was the last place a read still travelled through the wallet. `deployMultiVehicle` stays as an
action for a script or a server, where the client is one you built; drive the UI from the read
hooks once it lands.

The core actions are unchanged — `depositConduit` still approves and deposits for a caller who
supplies their own client, and `prepareDepositConduit` still returns the call and nothing else.

Fixes `deal` in the test helpers, which ignored its `account` parameter and always funded the
client's own account.
