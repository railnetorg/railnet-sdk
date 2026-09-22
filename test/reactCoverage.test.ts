import { describe, expect, it } from 'bun:test'
import { railnetActions } from '../src/decorator.js'
import * as react from '../src/react/index.js'

/** Needs an account; simulates a write. */
const NOT_A_QUERY = new Set(['simulateDispatchVehicle'])

const readActionNames = Object.keys(railnetActions({} as never))
  .filter((name) => !NOT_A_QUERY.has(name))
  .sort()

/** `getHasRole` is exposed as `hasRole`; an `estimate` or a `predict` keeps its verb. */
function queryName(action: string): string {
  if (!action.startsWith('get')) return action
  const stripped = action.slice(3)
  return stripped[0]?.toLowerCase() + stripped.slice(1)
}

const exported = react as Record<string, unknown>

describe('the React surface', () => {
  it.each(readActionNames)('covers %s', (action) => {
    const name = queryName(action)
    const hook = `use${name[0]?.toUpperCase()}${name.slice(1)}`

    expect({
      options: typeof exported[`${name}QueryOptions`],
      key: typeof exported[`${name}QueryKey`],
      prefix: Array.isArray(exported[`${name}QueryPrefix`]),
      hook: typeof exported[hook],
    }).toEqual({ options: 'function', key: 'function', prefix: true, hook: 'function' })
  })

  it('gives every read its own key prefix', () => {
    const prefixes = readActionNames.map((action) =>
      (exported[`${queryName(action)}QueryPrefix`] as readonly string[]).join('/'),
    )

    expect(new Set(prefixes).size).toBe(prefixes.length)
  })
})
