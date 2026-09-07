---
'@railnetorg/railnet-sdk': minor
---

Point `getAddresses` at the v1.0.0 protocol deployment on Ethereum (1) and Base (8453). Every
Railnet address the SDK shipped had been replaced upstream, so `0.5.0` resolves contracts that no
longer exist — calls against them revert or silently hit nothing.

Chain 1 now tracks the production manifest. It previously carried the staging deployment, which
lives on the same chain id and is therefore indistinguishable to a caller: anyone who trusted
`getAddresses(1)` for mainnet was pointed at staging contracts.

`wrapperVehicleFactory` is now optional. The production mainnet deployment ships no wrapper vehicle
factory, so reading it for chain 1 gives `undefined` — guard it, or key the feature to Base.
