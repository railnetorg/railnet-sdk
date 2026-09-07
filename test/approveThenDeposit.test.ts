import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { erc20Abi } from 'viem'
import { conduitAbi } from '../src/abi/conduit.js'
import { buildDepositConduitCall } from '../src/actions/conduit/depositConduit.js'
import { getConduitPosition } from '../src/actions/conduit/getConduitPosition.js'
import { randomSalt } from '../src/utils/salt.js'
import { type createRailnetTestClient, testAccount } from './client.js'
import { TEST_CONDUIT, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  const ctx = await setupAnvil()
  client = ctx.client
  await client.setAutomine(true)
}, 30_000)

afterAll(() => teardownAnvil())

describe('approve then deposit', () => {
  it('deposits once the conduit is approved', async () => {
    const account = testAccount(3)
    const amount = 5_000_000n

    await client.deal({ erc20: USDC, account: account.address, amount: 20_000_000n })

    const vehicle = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'getVehicle',
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

    expect(
      await client.readContract({
        address: USDC,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account.address, TEST_CONDUIT],
      }),
    ).toBe(amount)

    const depositHash = await client.writeContract({
      ...buildDepositConduitCall({
        conduit: TEST_CONDUIT,
        token: USDC,
        amount,
        sender: account.address,
        vehicle,
        salt: randomSalt(),
      }),
      account,
      chain: client.chain,
    })

    const receipt = await client.waitForTransactionReceipt({ hash: depositHash })
    expect(receipt.status).toBe('success')

    const position = await getConduitPosition(client, {
      conduit: TEST_CONDUIT,
      account: account.address,
    })
    expect(position.shares).toBeGreaterThan(0n)
  }, 60_000)

  it('reverts without an approval, which the SDK does not send for you', async () => {
    const account = testAccount(4)
    const amount = 1_000_000n

    await client.deal({ erc20: USDC, account: account.address, amount: 5_000_000n })

    const vehicle = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'getVehicle',
    })

    const deposit = client.simulateContract({
      ...buildDepositConduitCall({
        conduit: TEST_CONDUIT,
        token: USDC,
        amount,
        sender: account.address,
        vehicle,
        salt: randomSalt(),
      }),
      account,
    })

    await expect(deposit).rejects.toThrow(/allowance/i)
  }, 60_000)

  it('reverts when an account other than the built sender sends it', async () => {
    const builder = testAccount(5)
    const sender = testAccount(6)
    const amount = 1_000_000n

    await client.deal({ erc20: USDC, account: sender.address, amount: 5_000_000n })
    await client.waitForTransactionReceipt({
      hash: await client.writeContract({
        address: USDC,
        abi: erc20Abi,
        functionName: 'approve',
        args: [TEST_CONDUIT, amount],
        account: sender,
        chain: client.chain,
      }),
    })

    const vehicle = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'getVehicle',
    })

    const deposit = client.simulateContract({
      ...buildDepositConduitCall({
        conduit: TEST_CONDUIT,
        token: USDC,
        amount,
        sender: builder.address,
        vehicle,
        salt: randomSalt(),
      }),
      account: sender,
    })

    await expect(deposit).rejects.toThrow(/InvalidQuerySalt/i)
  }, 60_000)
})
