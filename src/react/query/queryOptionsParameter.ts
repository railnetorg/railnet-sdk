import type { DefaultError, QueryKey, SkipToken, UseQueryOptions } from '@tanstack/react-query'

type ReadQueryOptions = (...args: never[]) => {
  queryFn: (() => Promise<unknown>) | SkipToken
  queryKey: QueryKey
}

/** What a read's `queryFn` resolves to. */
export type QueryData<options extends ReadQueryOptions> = Awaited<
  ReturnType<Exclude<ReturnType<options>['queryFn'], SkipToken>>
>

/**
 * The `useQuery` options a read hook forwards. The read owns `queryKey` and `queryFn`, and the
 * hook's own `enabled` owns `enabled`.
 */
export type QueryOptionsParameter<
  options extends ReadQueryOptions,
  selectData = QueryData<options>,
> = Omit<
  UseQueryOptions<QueryData<options>, DefaultError, selectData, ReturnType<options>['queryKey']>,
  'queryKey' | 'queryFn' | 'enabled'
>
