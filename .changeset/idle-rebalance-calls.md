---
'@railnetorg/railnet-sdk': minor
---

Added `buildWithdrawToIdleCall` and `buildAllocateIdleCall`, which move a multi-vehicle position
between a sub-vehicle and AVAILABLE as one `multicall` of a move and a dispatch
([#87](https://github.com/railnetorg/railnet-sdk/pull/87)).

- `buildRebalanceRedeemCall` settles into the destination vehicle's own sector; withdrawing to idle
  settles into AVAILABLE instead, where the queue strategy engine can reach the proceeds again.
- Both pin the amount rather than sweeping with the `maxUint256` sentinel. A limit reverts
  `DispatchRedeemAmountTooHigh` or `DispatchDepositAmountTooHigh` instead of moving less.
- A cap on the allocation target reverts `DepositLimitedByCap`.
- Both take an optional `minOutput`.
- Needs MULTI_VEHICLE_MOVE and MULTI_VEHICLE_DISPATCH.
