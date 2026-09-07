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

**The write actions are gone, and the builders remain.** Sixteen of them were a `prepare*` call
wrapped in `simulateContract` then `writeContract`, and two also hid an ERC-20 approve and a
`getVehicle` read. None of that is Railnet knowledge — the salt derivation, the rule that a
deposit's output asset must name the vehicle, the encoding — that lives in the builders, and it
stays. Sending a built call is `simulateContract` then `writeContract` — two lines of viem, so the SDK
does not wrap them for you either. The React hooks share one internal helper for it, because there
the two clients differ.

**`deployMultiVehicle` is gone too.** It hid eight or more transactions against several factories
behind one call, so a caller could not report progress, retry a step, or see which one failed. The
knowledge it carried is still shipped: the log parsers (`extractMultiVehicleContracts`,
`extractAccessControlAddress`) are exported, and the order — which scope each role needs, why
granting after authorizing fails — is a guide at `/workflows/deployingAMultiVehicle` and in the
vehicle skill. An order you can read beats an order you cannot step through.

The read actions and the `railnetActions` decorator, which only ever exposed reads, are untouched.

Docs and skills follow: the action pages become builder pages, and the skills no longer teach that
a single wallet client should do both the simulation and the signing.

Fixes `deal` in the test helpers, which ignored its `account` parameter and always funded the
client's own account.
