---
'@railnetorg/railnet-sdk': minor
---

Added the unscoped half of the role surface ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). Only the scoped variants shipped, while
`getHasRole` already read `hasRoleOrScopedRole`, so a global role could be read and never written.

- `buildGrantRoleCall` and `buildRevokeRoleCall` apply to every scope. Prefer the scoped builder,
  which confines a role to the contract performing the gated call.
- `buildRenounceRoleCall` gives up a role the caller holds. `DEFAULT_ADMIN_ROLE` is refused.
- `buildSetRolePublicCall` takes `DEFAULT_ADMIN_ROLE` only, unlike its scoped variant, which takes
  the role's own admin.
- Pass a base role, never one already encoded against a scope: the contract cannot tell them apart
  and would grant the encoded value under the global admin.
