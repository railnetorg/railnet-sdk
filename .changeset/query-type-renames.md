---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Renamed the two conduit-scoped protocol enums to the query-scoped names the contracts
use ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

```diff
- import { ConduitMode, ConduitState } from '@railnetorg/railnet-sdk'
+ import { QueryMode, QueryState } from '@railnetorg/railnet-sdk'
```

- Neither was conduit-specific: vehicles, the sector accounting engine and the estimators all read
  the same values.
