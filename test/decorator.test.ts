import { describe, expect, it } from 'bun:test'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import * as sdk from '../src/index.js'
import { railnetActions } from '../src/index.js'

/**
 * A read action is a two-argument `(client, parameters)` export named for what it does. The
 * builders take one argument and the receipt helpers take `(receipt, address)`, so neither is
 * caught by the name prefixes.
 */
function readActionNames(): string[] {
  return Object.entries(sdk)
    .filter(
      ([name, value]) =>
        typeof value === 'function' &&
        value.length === 2 &&
        /^(get|estimate|predict|simulate)/.test(name),
    )
    .map(([name]) => name)
    .sort()
}

describe('railnetActions', () => {
  // Derived from the exports rather than listed here, so a read action added later cannot be
  // left off the decorator.
  it('exposes every read action the package ships', () => {
    const decorated = Object.keys(railnetActions({} as never)).sort()

    expect(decorated).toEqual(readActionNames())
  })

  it('binds the client it was extended onto', async () => {
    const client = createPublicClient({
      chain: base,
      transport: http('http://127.0.0.1:1'),
    }).extend(railnetActions)

    expect(typeof client.getConduitInfo).toBe('function')
    // Reaches the dead transport rather than failing to resolve the action.
    await expect(client.getHasRole({} as never)).rejects.toThrow()
  })
})
