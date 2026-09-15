---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Renamed the conduit-scoped protocol types to the query-scoped names the contracts
use, and moved them to `src/types.ts` alongside `Asset`, `Query`, `Interception` and
`EstimationType`. All six stay exported from the package root.

```diff
- import { ConduitMode, ConduitState, buildEnableConduitCall } from '@railnetorg/railnet-sdk'
+ import { QueryMode, QueryState, buildEnableConduitTransfersCall } from '@railnetorg/railnet-sdk'

- const call = buildEnableConduitCall({ conduit })
+ const call = buildEnableConduitTransfersCall({ conduit })
```

`buildEnableConduitTransfersCall` builds `conduit.enableTransfers()`, which is what the old name
already called.
