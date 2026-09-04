/**
 * Hands the key back on the query result, so a caller can invalidate what it is displaying
 * without knowing which chain the client resolved to. Assigned rather than spread: a v5 result
 * tracks which fields were read to decide what re-renders, and spreading reads all of them.
 */
export function attachQueryKey<TResult extends object, TQueryKey>(
  result: TResult,
  queryKey: TQueryKey,
): TResult & { queryKey: TQueryKey } {
  return Object.assign(result, { queryKey })
}
