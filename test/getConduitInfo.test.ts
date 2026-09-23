import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { getConduitInfo } from '../src/actions/conduit/getConduitInfo.js'
import type { createRailnetTestClient } from './client.js'
import { TEST_CONDUIT, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  client = (await setupAnvil()).client
}, 30_000)

afterAll(() => teardownAnvil())

describe('getConduitInfo', () => {
  it('returns the conduit and its asset', async () => {
    const info = await getConduitInfo(client, { conduit: TEST_CONDUIT })

    expect(info.conduit).toBe(TEST_CONDUIT)
    expect(info.asset).toBe(USDC)
  })
})
