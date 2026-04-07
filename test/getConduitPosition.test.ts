import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { type createRailnetTestClient, testAccount } from './client.js'
import { TEST_CONDUIT } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  const ctx = await setupAnvil()
  client = ctx.client
}, 30_000)

afterAll(() => teardownAnvil())

describe('getConduitPosition', () => {
  it('returns zero shares and assets for account with no position', async () => {
    const randomAccount = testAccount(5)

    const position = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: randomAccount.address,
    })

    expect(position.shares).toBe(0n)
    expect(position.assets).toBe(0n)
    expect(position.conduit).toBe(TEST_CONDUIT)
    expect(position.account).toBe(randomAccount.address)
  })

  it('returns conduit and account in the result', async () => {
    const position = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: client.account.address,
    })

    expect(position.conduit).toBe(TEST_CONDUIT)
    expect(position.account).toBe(client.account.address)
    expect(typeof position.shares).toBe('bigint')
    expect(typeof position.assets).toBe('bigint')
  })
})
