---
'@railnetorg/railnet-sdk': patch
---

Fixed four `railnetErrorHints` entries that described the wrong condition, and added the two they
were standing in for ([#51](https://github.com/railnetorg/railnet-sdk/pull/51)).

- `DisabledVehicle` said "paused or frozen at the beacon". Its only raise site is the vehicle's
  `enabled` flag; a paused beacon raises `EnforcedPause`.
- `PublicRoleAuthDenied` carried the text for `DefaultAdminCannotBePublic`, which had no entry.
- `NotAllowed` described the sender being refused, which is `CreateNotAllowed`, also missing.
- `InvalidPoolAddressesProvider` claimed the provider was the wrong one; it only checks for a zero
  address or no code.
