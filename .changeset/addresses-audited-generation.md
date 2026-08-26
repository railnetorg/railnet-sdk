---
"@railnetorg/railnet-sdk": minor
---

Rotate every protocol address onto the audited deployment generation, and add Ethereum (`1`) alongside Base (`8453`).

All 15 protocol addresses pointed at a superseded generation while the ABIs had already been resynced from `audit-remediation`, so the two halves of the SDK spoke to different deployments:

- **`spawnConduit` could not work.** The `spawn` selector our ABI encodes (`0x9d0c036e`) is absent from the factory we shipped and present in the audited one.
- **`getInitialDepositAmount` under-reported.** The registry we shipped returns `1000000` for USDC where the audited one requires `2000000`, so a caller would approve half of what the factory pulls and the spawn would revert.
- A conduit spawned by the old factory sits on a beacon whose `estimate`/`convert` still take `Asset[]`, which the scalar ABI cannot call.

No test caught this because none of them touched a factory address. `addresses.test.ts` now asserts on-chain that the conduit factory we ship acknowledges the fixture the scalar ABI is proven against — swapping the old address back fails it.

Each chain's block is annotated with the contracts deployment file it was transcribed from.

Ethereum's deployment authorizes no assets yet, so `getInitialDepositAmount` reverts there and spawning will too. The addresses are correct; the chain is not provisioned.
