import { describe, expect, test } from 'bun:test'
import { type Address, type Client, createPublicClient, custom, numberToHex, zeroHash } from 'viem'
import { base } from 'viem/chains'
import { SECTOR_AVAILABLE } from '../src/constants/sectors.js'
import * as sdk from '../src/index.js'
import * as react from '../src/react/index.js'
import { EstimationType, QueryMode } from '../src/types.js'

const ADDRESS: Address = '0x1111111111111111111111111111111111111111'
const ASSET = { asset: ADDRESS, value: 1n }
const BLOCK = 21_000_000n

/** Parameters each state read is called with. A read added to the package lands here or below. */
const STATE_READS: Record<string, object> = {
  estimateConduit: {
    conduit: ADDRESS,
    asset: ASSET,
    mode: QueryMode.DEPOSIT,
    estimationType: EstimationType.INPUT,
  },
  estimateVehicle: {
    vehicle: ADDRESS,
    asset: ASSET,
    mode: QueryMode.DEPOSIT,
    estimationType: EstimationType.INPUT,
  },
  getAccountListStatus: { accountList: ADDRESS, account: ADDRESS },
  getConduitInfo: { conduit: ADDRESS },
  getConduitInterceptions: { conduit: ADDRESS },
  getConduitPosition: { conduit: ADDRESS, account: ADDRESS },
  getHasRole: { accessControl: ADDRESS, role: zeroHash, scope: ADDRESS, account: ADDRESS },
  getInitialDepositAmount: { assetRegistry: ADDRESS, asset: ADDRESS },
  getIsTransferable: { conduit: ADDRESS, from: ADDRESS, to: ADDRESS },
  getMultiVehiclePositions: { sectorAccountingEngine: ADDRESS },
  getPendingDefaultAdmin: { accessControl: ADDRESS },
  getQueryClaim: { ownerRegistry: ADDRESS, conduit: ADDRESS, queryId: zeroHash },
  getQueryState: {
    vehicle: ADDRESS,
    query: {
      owner: ADDRESS,
      receiver: ADDRESS,
      input: ASSET,
      output: ASSET,
      mode: QueryMode.DEPOSIT,
      salt: zeroHash,
      data: '0x',
    },
  },
  getSectorBalance: { sectorAccountingEngine: ADDRESS, sector: SECTOR_AVAILABLE, asset: ADDRESS },
  getVehicleConversion: { vehicle: ADDRESS, asset: ASSET, sharesToAssets: true },
  getVehicleInterceptions: { vehicle: ADDRESS },
  getVehicleManagerLimits: { vehicleManager: ADDRESS },
}

/** Reads a block would not change, and why. */
const NOT_AT_A_BLOCK: Record<string, string> = {
  getDepositConduitCall: 'builds a call to send now; reads only the conduit vehicle',
  getRedeemConduitCall: 'builds a call to send now; reads only the conduit asset',
  getMorphoBlueSingleton: 'reads immutables',
  getMorphoMarketAsset: 'Morpho market params are immutable',
  simulateDispatchVehicle: 'simulates a transaction about to be sent',
}

function readActionNames(): string[] {
  return Object.entries(sdk)
    .filter(
      ([name, value]) =>
        typeof value === 'function' && value.length === 2 && /^(get|estimate|simulate)/.test(name),
    )
    .map(([name]) => name)
    .sort()
}

/** Records the block tag of every eth_call, then fails it: the test only checks what was asked. */
function recordingClient() {
  const blockTags: unknown[] = []
  const client = createPublicClient({
    chain: base,
    transport: custom(
      {
        request: async ({ method, params }) => {
          if (method === 'eth_call') blockTags.push((params as unknown[])[1])
          throw new Error(`stub: ${method}`)
        },
      },
      { retryCount: 0 },
    ),
  })
  return { client, blockTags }
}

describe('read actions take a blockNumber', () => {
  test('every read action is either a state read or listed with a reason, so a new one cannot skip the parameter unnoticed', () => {
    const classified = [...Object.keys(STATE_READS), ...Object.keys(NOT_AT_A_BLOCK)].sort()

    expect(readActionNames()).toEqual(classified)
  })

  test.each(Object.entries(STATE_READS))(
    '%s sends every eth_call at the blockNumber it is given',
    async (name, parameters) => {
      const action = (
        sdk as unknown as Record<string, (client: Client, p: object) => Promise<unknown>>
      )[name]
      const { client, blockTags } = recordingClient()

      await action?.(client, { ...parameters, blockNumber: BLOCK }).catch(() => undefined)

      expect(blockTags.length).toBeGreaterThan(0)
      expect(blockTags.every((tag) => tag === numberToHex(BLOCK))).toBe(true)
    },
  )

  test.each(Object.entries(STATE_READS))(
    "%s query options forward the blockNumber to the read and key it, so a hook's pinned read never caches as the live one",
    async (name, parameters) => {
      const optionsName = `${name.replace(/^get/, '').replace(/^./, (first) => first.toLowerCase())}QueryOptions`
      const queryOptions = (
        react as unknown as Record<
          string,
          (client: Client, p: object) => { queryFn: () => Promise<unknown>; queryKey: unknown[] }
        >
      )[optionsName]
      const { client, blockTags } = recordingClient()

      const options = queryOptions?.(client, { ...parameters, blockNumber: BLOCK })
      await options?.queryFn().catch(() => undefined)

      expect(options?.queryKey.at(-1)).toMatchObject({ blockNumber: BLOCK.toString() })
      expect(blockTags.length).toBeGreaterThan(0)
      expect(blockTags.every((tag) => tag === numberToHex(BLOCK))).toBe(true)
    },
  )
})
