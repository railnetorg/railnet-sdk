import type { DefaultError, QueryKey, SkipToken, UseQueryOptions } from '@tanstack/react-query'

type ReadQueryOptions = (...args: never[]) => {
  queryFn: (() => Promise<unknown>) | SkipToken
  queryKey: QueryKey
}

/** What a read's `queryFn` resolves to. */
export type QueryData<options extends ReadQueryOptions> = Awaited<
  ReturnType<Exclude<ReturnType<options>['queryFn'], SkipToken>>
>

/** `useQuery` options a hook forwards, except the `queryKey`, `queryFn` and `enabled` it sets. */
export type QueryOptionsParameter<
  options extends ReadQueryOptions,
  selectData = QueryData<options>,
> = Omit<
  UseQueryOptions<QueryData<options>, DefaultError, selectData, ReturnType<options>['queryKey']>,
  'queryKey' | 'queryFn' | 'enabled'
>
