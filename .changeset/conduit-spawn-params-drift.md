---
'@railnetorg/railnet-sdk': patch
---

Fixed `predictConduitDeployment` returning an address the matching spawn would not deploy to
([#41](https://github.com/railnetorg/railnet-sdk/pull/41)). It built its own `SpawnParams` tuple, so any field the two mapped differently moved the
CREATE2 result; both now share one mapping.
