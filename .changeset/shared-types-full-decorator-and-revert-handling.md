---
'@railnetorg/railnet-sdk': minor
---

Shared protocol types, revert decoding, and stricter call builders.

**Breaking**

- `ConduitMode` is now `QueryMode` and `ConduitState` is now `QueryState`. Both move to
  `src/types.ts` with `Asset`, `Query`, `Interception` and `EstimationType`; all six stay exported
  from the package root.
- `buildEnableConduitCall` is replaced by `buildEnableConduitTransfersCall`, which builds
  `conduit.enableTransfers()`.
- Call builders throw on input the contracts reject: a fee split that is empty, out of order or
  short of 10000 bps, a rate above its ceiling, `sanctionsEnabled` without an oracle, and a zero
  address or a duplicate in an allow- or block-list batch.

**Added**

- `getRailnetError(error)` returns a revert's decoded name, its arguments and a hint, or `null`
  when the failure was not a contract revert. `railnetErrorHints` is the hint table.

  ```ts
  const reverted = getRailnetError(error)
  if (reverted?.name === 'InsufficientAllowance') return approveFirst()
  ```

- `protocolErrorsAbi`, the errors no contract ABI declares. `getRailnetError` falls back to it, so
  `InvalidOutput`, `InvalidEstimation`, `MaxDepositTooLow`, `MaxRedeemTooLow`, `InvalidState` and
  `DisabledVehicle` decode.
- `assertFeeRecipients` and `assertFees`, to validate a fee split before building a call.
- `railnetActions` exposes every read action.

**Fixed**

- `depositFeeBps` and `redeemFeeBps` cap at 9999, not 10000.
- `buildSpawnFeeManagerCall` checks `initialFees` against `initialMaxFees`.
- `buildSpawnConduitCall` and `predictConduitDeployment` share one `SpawnParams` mapping.
- `getAddresses(8453)` throws: Base is staging-only, and the supported-chains table said otherwise.
