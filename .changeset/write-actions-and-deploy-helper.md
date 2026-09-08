---
'@railnetorg/railnet-sdk': minor
---

The SDK ships builders and reads. Composing and sending the transactions is yours.

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
