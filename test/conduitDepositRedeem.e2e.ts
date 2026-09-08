import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { erc20Abi } from 'viem'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { getDepositConduitCall } from '../src/actions/conduit/getDepositConduitCall.js'
import { getRedeemConduitCall } from '../src/actions/conduit/getRedeemConduitCall.js'
import { extractQueryIds } from '../src/index.js'
import { randomSalt } from '../src/utils/salt.js'
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
  it('deposits, credits shares, and redeems them back out', async () => {
    const amount = 1_000_000n
    await client.deal({ erc20: USDC, account, amount: amount * 2n })

    const before = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })

    const approveHash = await client.writeContract({
      address: USDC,
      abi: erc20Abi,
      functionName: 'approve',
      args: [TEST_CONDUIT, amount],
      account,
      chain: client.chain,
    })
    await client.waitForTransactionReceipt({ hash: approveHash })

    const deposit = await getDepositConduitCall(client, {
      conduit: TEST_CONDUIT,
      token: USDC,
      amount,
      sender: account.address,
      salt: randomSalt(),
    })

    const depositReceipt = await client.waitForTransactionReceipt({
      hash: await client.writeContract(
        (await client.simulateContract({ ...deposit.call, account })).request,
      ),
    })
    expect(depositReceipt.status).toBe('success')

    const createdByDeposit = extractQueryIds(depositReceipt, TEST_CONDUIT)
    expect(createdByDeposit).toHaveLength(1)
    expect(createdByDeposit[0]?.queryId).toBe(deposit.queryId)
    expect(createdByDeposit[0]?.receiver).toBe(account.address)

    const deposited = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(deposited.shares).toBeGreaterThan(before.shares)

    const redeem = await getRedeemConduitCall(client, {
      conduit: TEST_CONDUIT,
      shares: deposited.shares,
      sender: account.address,
      salt: randomSalt(),
    })

    const redeemReceipt = await client.waitForTransactionReceipt({
      hash: await client.writeContract(
        (await client.simulateContract({ ...redeem.call, account })).request,
      ),
    })
    expect(redeemReceipt.status).toBe('success')

    expect(extractQueryIds(redeemReceipt, TEST_CONDUIT)).toHaveLength(1)

    const after = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(after.shares).toBeLessThan(deposited.shares)
  }, 120_000)
})
