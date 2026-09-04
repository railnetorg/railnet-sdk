import { isAddress } from 'viem'

/**
 * Query keys are hashed with `JSON.stringify`, which throws on a bigint, and the same contract
 * reaches us in mixed case from different callers. Checksums are enforced so a free-form string
 * that merely looks like an address — a conduit `name`, which feeds the CREATE2 result — keeps
 * its casing and its own cache entry.
 */
export function normalizeQueryKeyValue(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'string') {
    return isAddress(value, { strict: true }) ? value.toLowerCase() : value
  }
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
