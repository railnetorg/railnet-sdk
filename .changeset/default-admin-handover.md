---
'@railnetorg/railnet-sdk': minor
---

Added the `DEFAULT_ADMIN_ROLE` handover builders and `getPendingDefaultAdmin`
([#85](https://github.com/railnetorg/railnet-sdk/pull/85)).

- Builders: `buildBeginDefaultAdminTransferCall`, `buildAcceptDefaultAdminTransferCall`,
  `buildCancelDefaultAdminTransferCall`.
- The handover is two-step and delayed. Begin schedules it `defaultAdminDelay` seconds out, and
  only the pending admin may accept, once `getPendingDefaultAdmin` reports a schedule in the past.
- Accepting early reverts `AccessControlEnforcedDefaultAdminDelay`. Begin overwrites a pending
  transfer rather than queueing a second one.
- `getPendingDefaultAdmin` is on `railnetActions`.
