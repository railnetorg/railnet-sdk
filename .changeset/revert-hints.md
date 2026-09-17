---
'@railnetorg/railnet-sdk': minor
---

Added `CreateNotAllowed` and `DefaultAdminCannotBePublic` to `railnetErrorHints`, and pointed four
entries at the condition they describe ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)).

- `DisabledVehicle` is the vehicle's own `enabled` flag, not the beacon; a paused beacon raises
  `EnforcedPause`.
- `PublicRoleAuthDenied` fires when a scoped role is public, refusing per-account grants.
- `NotAllowed` screens a third-party receiver; the sender being refused is `CreateNotAllowed`.
- `InvalidPoolAddressesProvider` checks for a zero address or no code, nothing else.
