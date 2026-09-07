import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { erc20Abi } from 'viem'
import { conduitAbi } from '../src/abi/conduit.js'
import { prepareDepositConduit } from '../src/actions/conduit/depositConduit.js'
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

describe('approve then deposit, as the hooks now split it', () => {
  it('deposits once the conduit is approved, with reads and the write kept apart', async () => {
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
      ...prepareDepositConduit({
        conduit: TEST_CONDUIT,
        token: USDC,
        amount,
        account: account.address,
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

  it('reverts without an approval, which is why the approve hook exists', async () => {
    const account = testAccount(4)
    const amount = 1_000_000n

    await client.deal({ erc20: USDC, account: account.address, amount: 5_000_000n })

    const vehicle = await client.readContract({
      address: TEST_CONDUIT,
      abi: conduitAbi,
      functionName: 'getVehicle',
    })

    const deposit = client.simulateContract({
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

    await expect(deposit).rejects.toThrow(/allowance/i)
  }, 60_000)
})
