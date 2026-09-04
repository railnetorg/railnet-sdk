/**
 * Query keys are hashed with `JSON.stringify`, which throws on a bigint. Casing is untouched: a
 * conduit `name` reaches `ConduitFactory._getInitCode`, so it changes the CREATE2 address a
 * prediction returns.
 */
export function normalizeQueryKeyValue(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return value.map(normalizeQueryKeyValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeQueryKeyValue(entry)]),
    )
  }
  return value
}

/**
 * A normalised parameter object, for spreading into a query key. The key describes what was
 * asked for, not the parameter types: a `bigint` field arrives here as a string.
 */
export function normalizeQueryKeyParameters(parameters: object): Record<string, unknown> {
  return normalizeQueryKeyValue(parameters) as Record<string, unknown>
}
