---
'@railnetorg/railnet-sdk': minor
---

Add the force-redeem builder, and the global role builders that were missing beside the scoped ones.

- `buildForceRedeemCall` builds `conduit.forceRedeem()`, the off-boarding path the AccountList docs
  already pointed at without a builder to reach it. `accountList.canForceRedeem(user, caller)` gates
  both sides: the holder must be sanctioned or block-listed, and the caller needs
  CONDUIT_FORCE_REDEEM. The proceeds go to the holder, never to the caller.
- `buildGrantRoleCall`, `buildRevokeRoleCall`, `buildRenounceRoleCall` and `buildSetRolePublicCall`
  cover the unscoped entrypoints. The SDK shipped only the scoped variants while `getHasRole` read
  `hasRoleOrScopedRole`, so a global role could be read and never written.

`setRolePublic` is `DEFAULT_ADMIN_ROLE` only, unlike its scoped variant, which takes the role's own
admin. A role already encoded against a scope must not be passed to these: the contract cannot tell
it from a base role and would grant it under the global admin, skipping every scoped-role semantic.
