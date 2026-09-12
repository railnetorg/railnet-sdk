---
'@railnetorg/railnet-sdk': minor
---

Add the last two modules a conduit takes at deployment: AccountList and OwnerRegistry.

AccountList is the compliance layer — `buildSpawnAccountListCall`, `predictAccountListDeployment`, and the manager calls for the mode, both lists, and sanctions screening. Its precedence reads backwards from most allow-list systems: sanctions beat the block-list, which beats the allow-list, and redeem consults sanctions alone, so a blocked holder can always take its own money out. Screening fails closed — an oracle that reverts or has no code marks everyone sanctioned, and a sanctioned account cannot even exit.

OwnerRegistry records who owns a conduit's live queries and lets that owner wrap the claim into a transferable ERC-721 — `buildSpawnOwnerRegistryCall`, `predictOwnerRegistryDeployment`. It carries no access control of its own.

Both are fixed on a conduit at spawn with no setter afterwards, so a conduit deployed without them stays without them.
