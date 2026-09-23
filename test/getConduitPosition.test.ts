import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { type createRailnetTestClient, testAccount } from './client.js'
import { LOCKED_SHARE_HOLDER, TEST_CONDUIT } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  client = (await setupAnvil()).client
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

  // `convert` takes a scalar `Asset`; against the superseded array-shaped ABI it reverts rather
  // than returning a value.
  it('converts a non-zero share balance into underlying assets', async () => {
    const position = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: LOCKED_SHARE_HOLDER,
    })

    expect(position.shares).toBeGreaterThan(0n)
    expect(position.assets).toBeGreaterThan(0n)
  })
})
