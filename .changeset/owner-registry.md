---
'@railnetorg/railnet-sdk': minor
---

Added OwnerRegistry, which records who owns a conduit's live queries and lets that owner wrap the
claim into a transferable ERC-721 — `buildSpawnOwnerRegistryCall`, `predictOwnerRegistryDeployment`.
It carries no access control of its own, and like AccountList it is fixed on the conduit at spawn.
