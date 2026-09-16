---
'@railnetorg/railnet-sdk': minor
---

Added AccountList, the compliance module a conduit takes at spawn — `buildSpawnAccountListCall`,
`predictAccountListDeployment`, and the manager calls for the mode, both lists and sanctions
screening ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- Precedence runs backwards from most allow-list systems: sanctions beat the block-list, which
  beats the allow-list.
- Redeem consults sanctions alone, so a blocked holder can still take its own money out.
- Screening fails closed: an oracle that reverts or has no code marks everyone sanctioned, and a
  sanctioned account cannot exit.
- Fixed on the conduit at spawn, with no setter afterwards.
