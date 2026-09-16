---
'@railnetorg/railnet-sdk': minor
---

Added OwnerRegistry, which records who owns a conduit's live queries — `buildSpawnOwnerRegistryCall`
and `predictOwnerRegistryDeployment` ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- An owner can wrap the claim into a transferable ERC-721.
- It carries no access control of its own; the caller needs FACTORY_SPAWN on the factory's.
- Fixed on the conduit at spawn, with no setter afterwards, as AccountList is.
