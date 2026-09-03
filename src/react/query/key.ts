import { isAddress } from 'viem'

/**
 * Query keys are hashed with `JSON.stringify`, which throws on a bigint, and the same contract
 * reaches us in mixed case from different callers.
 */
export function normalizeQueryKeyValue(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'string') {
    return isAddress(value, { strict: false }) ? value.toLowerCase() : value
  }
  if (Array.isArray(value)) return value.map(normalizeQueryKeyValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeQueryKeyValue(entry)]),
    )
  }
  return value
}
