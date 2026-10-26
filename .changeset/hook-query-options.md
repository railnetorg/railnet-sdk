---
"@railnetorg/railnet-sdk": minor
---

Added a `queryOptions` parameter on every `/react` read hook, forwarded to TanStack Query's `useQuery`.
  - Takes `UseQueryOptions` except `queryKey`, `queryFn` and `enabled`, which stay with the read and the hook.
  - `select` types `data`.

```ts
const { data, error } = useAccountListStatus({
  accountList,
  account,
  queryOptions: { throwOnError: false },
})
```
