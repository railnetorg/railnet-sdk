---
'@railnetorg/railnet-sdk': minor
---

Added `getRailnetError(error)`, which returns a revert's decoded name, its arguments and a hint, or
`null` when the failure was not a contract revert. `railnetErrorHints` is the hint table.

```ts
const reverted = getRailnetError(error)
if (reverted?.name === 'InsufficientAllowance') return approveFirst()
```

Added `protocolErrorsAbi`, the errors no contract ABI declares. `getRailnetError` falls back to it,
so `InvalidOutput`, `InvalidEstimation`, `MaxDepositTooLow`, `MaxRedeemTooLow`, `InvalidState` and
`DisabledVehicle` decode.
