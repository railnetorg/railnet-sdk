---
'@railnetorg/railnet-sdk': minor
---

Added `buildRenounceScopedRoleCall`, the scoped counterpart of `buildRenounceRoleCall` ([#86](https://github.com/railnetorg/railnet-sdk/pull/86)).

- `account` must be the sender; the contract reverts `OnlyOwnerCanRenounce` otherwise.
- Needs no admin role, unlike `buildRevokeScopedRoleCall`.
