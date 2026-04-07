import { afterAll, beforeAll, describe, it } from 'bun:test'
import type { createRailnetTestClient } from './client.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let _client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  const ctx = await setupAnvil()
  _client = ctx.client
}, 30_000)

afterAll(() => teardownAnvil())

describe('estimateConduit', () => {
  it.skip('returns an array of assets for a deposit estimate', () => {})
  it.skip('returns an array of assets for a redeem estimate', () => {})
})
