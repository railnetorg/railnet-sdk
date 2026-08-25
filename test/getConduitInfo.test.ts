import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { getConduitInfo } from '../src/actions/conduit/getConduitInfo.js'
import type { createRailnetTestClient } from './client.js'
import { TEST_CONDUIT, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  const ctx = await setupAnvil()
  client = ctx.client
}, 30_000)

afterAll(() => teardownAnvil())

describe('getConduitInfo', () => {
  it('returns correct conduit metadata', async () => {
    const info = await getConduitInfo(client, { conduit: TEST_CONDUIT })

    expect(info.conduit).toBe(TEST_CONDUIT)
    expect(info.asset).toBe(USDC)
    expect(typeof info.name).toBe('string')
    expect(typeof info.symbol).toBe('string')
    expect(typeof info.decimals).toBe('number')
  })

  it('returns numeric fields as expected types', async () => {
    const info = await getConduitInfo(client, { conduit: TEST_CONDUIT })

    expect(typeof info.totalSupply).toBe('bigint')
    expect(typeof info.totalAssets).toBe('bigint')
    expect(typeof info.holdings).toBe('bigint')
    expect(typeof info.decimals).toBe('number')
    expect(typeof info.isEnabled).toBe('boolean')
  })
})
