import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { depositConduit } from '../src/actions/conduit/depositConduit.js'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { redeemConduit } from '../src/actions/conduit/redeemConduit.js'
import { type createRailnetTestClient, testAccount } from './client.js'
import { TEST_CONDUIT, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

// account index 0 only: test/deal.ts credits the first mnemonic account and no other
const account = testAccount()

beforeAll(async () => {
  const ctx = await setupAnvil()
  client = ctx.client
  // the shared anvil runs with --no-mining
  await client.setAutomine(true)
}, 30_000)

afterAll(() => teardownAnvil())

describe('conduit deposit and redeem', () => {
  it('deposits and credits the depositor with conduit shares', async () => {
    const amount = 1_000_000n

    await client.deal({ erc20: USDC, account, amount: amount * 2n })

    const before = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })

    const hash = await depositConduit(client, {
      conduit: TEST_CONDUIT,
      token: USDC,
      amount,
      account: account.address,
    })
    const receipt = await client.waitForTransactionReceipt({ hash })

    expect(receipt.status).toBe('success')

    const after = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(after.shares).toBeGreaterThan(before.shares)
  }, 60_000)

  it('redeems the shares back out', async () => {
    const amount = 1_000_000n

    await client.deal({ erc20: USDC, account, amount: amount * 10n })

    await client.waitForTransactionReceipt({
      hash: await depositConduit(client, {
        conduit: TEST_CONDUIT,
        token: USDC,
        amount,
        account: account.address,
      }),
    })

    const deposited = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(deposited.shares).toBeGreaterThan(0n)

    const receipt = await client.waitForTransactionReceipt({
      hash: await redeemConduit(client, {
        conduit: TEST_CONDUIT,
        shares: deposited.shares,
        account: account.address,
      }),
    })

    expect(receipt.status).toBe('success')

    const after = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(after.shares).toBeLessThan(deposited.shares)
  }, 60_000)
})
