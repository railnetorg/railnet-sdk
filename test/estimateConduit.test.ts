import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { EstimationType, estimateConduit } from '../src/actions/conduit/estimateConduit.js'
import { ConduitMode } from '../src/actions/conduit/types.js'
import type { createRailnetTestClient } from './client.js'
import { TEST_CONDUIT, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  const ctx = await setupAnvil()
  client = ctx.client
}, 30_000)

afterAll(() => teardownAnvil())

describe('estimateConduit', () => {
  it('returns the estimated cShare output for a deposit estimate', async () => {
    const estimation = await estimateConduit(client, {
      conduit: TEST_CONDUIT,
      asset: { asset: USDC, value: 1_000_000n },
      mode: ConduitMode.DEPOSIT,
      estimationType: EstimationType.OUTPUT,
    })

    expect(estimation.asset.toLowerCase()).toBe(TEST_CONDUIT)
    expect(estimation.value).toBeGreaterThan(0n)
  })

  it('returns the estimated asset output for a redeem estimate', async () => {
    const estimation = await estimateConduit(client, {
      conduit: TEST_CONDUIT,
      asset: { asset: TEST_CONDUIT, value: 10n ** 18n },
      mode: ConduitMode.REDEEM,
      estimationType: EstimationType.OUTPUT,
    })

    expect(estimation.asset).toBe(USDC)
    expect(estimation.value).toBeGreaterThan(0n)
  })
})
