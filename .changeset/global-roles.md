---
'@railnetorg/railnet-sdk': minor
---

Added `buildGrantRoleCall`, `buildRevokeRoleCall`, `buildRenounceRoleCall` and
`buildSetRolePublicCall`, covering the unscoped entrypoints ([#54](https://github.com/railnetorg/railnet-sdk/pull/54)). Only the scoped variants
shipped, while `getHasRole` already read `hasRoleOrScopedRole`.

- A global grant applies to every scope. Prefer the scoped builder, which confines a role to the
  contract performing the gated call.
- `setRolePublic` takes `DEFAULT_ADMIN_ROLE` only, unlike its scoped variant, which takes the
  role's own admin.
- Pass a base role, never one already encoded against a scope: the contract cannot tell them apart
  and would grant the encoded value under the global admin.
