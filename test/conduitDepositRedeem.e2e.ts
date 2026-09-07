import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { erc20Abi } from 'viem'
import { conduitAbi } from '../src/abi/conduit.js'
import { prepareDepositConduit } from '../src/actions/conduit/depositConduit.js'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { prepareRedeemConduit } from '../src/actions/conduit/redeemConduit.js'
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

    const vehicle = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'getVehicle',
    })

    const depositReceipt = await client.waitForTransactionReceipt({
      hash: await client.writeContract(
        (
          await client.simulateContract({
            ...prepareDepositConduit({
              conduit: TEST_CONDUIT,
              token: USDC,
              amount,
              account: account.address,
              vehicle,
              salt: randomSalt(),
            }),
            account,
          })
        ).request,
      ),
    })
    expect(depositReceipt.status).toBe('success')

    const deposited = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(deposited.shares).toBeGreaterThan(before.shares)

    const conduitAsset = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'asset',
    })

    const redeemReceipt = await client.waitForTransactionReceipt({
      hash: await client.writeContract(
        (
          await client.simulateContract({
            ...prepareRedeemConduit({
              conduit: TEST_CONDUIT,
              shares: deposited.shares,
              account: account.address,
              outputAsset: { asset: conduitAsset, value: 0n },
              salt: randomSalt(),
            }),
            account,
          })
        ).request,
      ),
    })
    expect(redeemReceipt.status).toBe('success')

    const after = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(after.shares).toBeLessThan(deposited.shares)
  }, 120_000)
})
