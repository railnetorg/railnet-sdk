import { describe, expect, test } from 'bun:test'
import {
  type Address,
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeFunctionResult,
  type Hex,
  numberToHex,
} from 'viem'
import { sectorAccountingEngineAbi } from '../src/abi/sectorAccountingEngine.js'
import {
  type GetMultiVehiclePositionsReturnType,
  getMultiVehiclePositions,
} from '../src/actions/multiVehicle/getMultiVehiclePositions.js'
import { SECTOR_AVAILABLE, SECTOR_RESERVED } from '../src/constants/sectors.js'
import { multiVehiclePositionsQueryOptions } from '../src/react/query/multiVehiclePositions.js'

const ENGINE: Address = '0x1111111111111111111111111111111111111111'
const USDC: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const FIRST: Address = '0x2Ec94b8979868bF5586f8550733092a77Cd77C9E'
const SECOND: Address = '0x36Fbc89D0d2bFCc333e0075bd73c6A4dFcBA121A'

type Engine = {
  activeVehicles: Address[]
  available: bigint
  reserved: bigint
  holdings: Record<Address, readonly [bigint, bigint, bigint, bigint, bigint]>
}

/** Answers the engine's views from `engine` and records each eth_call with the block it asked for. */
function stubClient(engine: Engine, currentBlock = 21_000_000n) {
  const calls: Array<{ functionName: string; args: readonly unknown[]; block: unknown }> = []
  let blockNumberRequests = 0

  const client = createPublicClient({
    transport: custom({
      request: async ({ method, params }) => {
        if (method === 'eth_blockNumber') {
          blockNumberRequests++
          return numberToHex(currentBlock)
        }
        if (method !== 'eth_call') throw new Error(`unexpected RPC call: ${method}`)

        const [call, block] = params as [{ to: Address; data: Hex }, unknown]
        if (call.to.toLowerCase() !== ENGINE) throw new Error(`unexpected target ${call.to}`)
        const { functionName, args = [] } = decodeFunctionData({
          abi: sectorAccountingEngineAbi,
          data: call.data,
        })
        calls.push({ functionName, args, block })

        if (functionName === 'asset') {
          return encodeFunctionResult({
            abi: sectorAccountingEngineAbi,
            functionName,
            result: USDC,
          })
        }
        if (functionName === 'activeVehicles') {
          return encodeFunctionResult({
            abi: sectorAccountingEngineAbi,
            functionName,
            result: engine.activeVehicles,
          })
        }
        if (functionName === 'getSectorBalance') {
          const [sector] = args as [Hex, Address]
          const result = sector === SECTOR_AVAILABLE ? engine.available : engine.reserved
          return encodeFunctionResult({ abi: sectorAccountingEngineAbi, functionName, result })
        }
        if (functionName === 'vehicleHoldings') {
          const [vehicle] = args as [Address]
          const result = engine.holdings[vehicle]
          if (!result) throw new Error(`no holdings for ${vehicle}`)
          return encodeFunctionResult({ abi: sectorAccountingEngineAbi, functionName, result })
        }
        throw new Error(`unexpected function ${functionName}`)
      },
    }),
  })

  return { client, calls, blockNumberRequests: () => blockNumberRequests }
}

const TWO_VEHICLES: Engine = {
  activeVehicles: [FIRST, SECOND],
  available: 2_000_000n,
  reserved: 300_000n,
  holdings: {
    [FIRST]: [11n, 22n, 33n, 44n, 55n],
    [SECOND]: [66n, 0n, 0n, 0n, 77n],
  },
}

describe('getMultiVehiclePositions', () => {
  test('names the five vehicleHoldings returns in ISectorAccountingEngine order, so no amount lands in another field', async () => {
    const { client } = stubClient(TWO_VEHICLES)

    const positions = await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })

    expect(positions.vehicles).toEqual([
      {
        vehicle: FIRST,
        sharesAfterUnlocks: 11n,
        sharesBeforeCreates: 22n,
        expectedSharesAfterUnlocks: 33n,
        expectedAssetsAfterUnlocks: 44n,
        assetsBeforeCreates: 55n,
      },
      {
        vehicle: SECOND,
        sharesAfterUnlocks: 66n,
        sharesBeforeCreates: 0n,
        expectedSharesAfterUnlocks: 0n,
        expectedAssetsAfterUnlocks: 0n,
        assetsBeforeCreates: 77n,
      },
    ])
  })

  test("reads AVAILABLE and RESERVED of the engine's own asset, so idle and earmarked cash are never read in another token", async () => {
    const { client, calls } = stubClient(TWO_VEHICLES)

    const positions = await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })

    expect([positions.asset, positions.available, positions.reserved]).toEqual([
      USDC,
      2_000_000n,
      300_000n,
    ])
    expect(
      calls.filter((call) => call.functionName === 'getSectorBalance').map((call) => call.args),
    ).toEqual([
      [SECTOR_AVAILABLE, USDC],
      [SECTOR_RESERVED, USDC],
    ])
  })

  test('reads holdings for every vehicle in activeVehicles(), the set totalAssets() values, so a vehicle unauthorized with a query in flight still counts', async () => {
    const { client, calls } = stubClient(TWO_VEHICLES)

    await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })

    expect(
      calls.filter((call) => call.functionName === 'vehicleHoldings').map((call) => call.args),
    ).toEqual([[FIRST], [SECOND]])
  })

  test('an engine with no active vehicle still returns its idle and reserved cash', async () => {
    const { client } = stubClient({ activeVehicles: [], available: 5n, reserved: 1n, holdings: {} })

    const positions = await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })

    expect([positions.available, positions.reserved, positions.vehicles]).toEqual([5n, 1n, []])
  })

  test('pins every read to the block it was given and asks for none, so a dispatch between two reads is never counted twice', async () => {
    const { client, calls, blockNumberRequests } = stubClient(TWO_VEHICLES)

    const positions = await getMultiVehiclePositions(client, {
      sectorAccountingEngine: ENGINE,
      blockNumber: 20_999_000n,
    })

    expect(blockNumberRequests()).toBe(0)
    expect(new Set(calls.map((call) => call.block))).toEqual(new Set([numberToHex(20_999_000n)]))
    expect(calls).toHaveLength(6)
    expect(positions.blockNumber).toBe(20_999_000n)
  })

  test('resolves the current block once per read, never from viem cache, and pins every read to it', async () => {
    const { client, calls, blockNumberRequests } = stubClient(TWO_VEHICLES)

    const first = await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })
    await getMultiVehiclePositions(client, { sectorAccountingEngine: ENGINE })

    expect(blockNumberRequests()).toBe(2)
    expect(new Set(calls.map((call) => call.block))).toEqual(new Set([numberToHex(21_000_000n)]))
    expect(first.blockNumber).toBe(21_000_000n)
  })
})

describe('multiVehiclePositionsQueryOptions', () => {
  test('passes blockNumber through to the action', async () => {
    const { client, blockNumberRequests } = stubClient(TWO_VEHICLES)

    const { queryFn } = multiVehiclePositionsQueryOptions(client, {
      sectorAccountingEngine: ENGINE,
      blockNumber: 20_999_000n,
    })
    const positions = await (queryFn as () => Promise<GetMultiVehiclePositionsReturnType>)()

    expect(blockNumberRequests()).toBe(0)
    expect(positions.blockNumber).toBe(20_999_000n)
  })

  test('carries the block into the query key, so a pinned read caches apart from the live one', () => {
    const { client } = stubClient(TWO_VEHICLES)

    const pinned = multiVehiclePositionsQueryOptions(client, {
      sectorAccountingEngine: ENGINE,
      blockNumber: 20_999_000n,
    })
    const live = multiVehiclePositionsQueryOptions(client, { sectorAccountingEngine: ENGINE })

    expect(pinned.queryKey).not.toEqual(live.queryKey)
    expect(pinned.queryKey[2]).toMatchObject({ blockNumber: '20999000' })
  })
})
