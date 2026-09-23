---
'@railnetorg/railnet-sdk': minor
---

**Breaking:** Removed `ConduitMode` and `ConduitState`, deprecated in 0.8.0
([#89](https://github.com/railnetorg/railnet-sdk/pull/89)).

```diff
- import { ConduitMode, ConduitState } from '@railnetorg/railnet-sdk'
+ import { QueryMode, QueryState } from '@railnetorg/railnet-sdk'
```

- Members and values unchanged.
