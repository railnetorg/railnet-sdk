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

The core actions are unchanged — `depositConduit` still approves and deposits for a caller who
supplies their own client, and `prepareDepositConduit` still returns the call and nothing else.

Fixes `deal` in the test helpers, which ignored its `account` parameter and always funded the
client's own account.
