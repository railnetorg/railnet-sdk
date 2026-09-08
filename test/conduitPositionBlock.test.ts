import { describe, expect, test } from 'bun:test'
import { createPublicClient, custom, encodeAbiParameters, numberToHex } from 'viem'
import {
  type GetConduitPositionReturnType,
  getConduitPosition,
} from '../src/actions/conduit/getConduitPosition.js'
import { conduitPositionQueryOptions } from '../src/react/query/conduitPosition.js'

const CONDUIT = '0x36Fbc89D0d2bFCc333e0075bd73c6A4dFcBA121A' as const
const ACCOUNT = '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

const BALANCE_OF_SELECTOR = '0x70a08231'
const SHARES = 5_000n

/** Records every RPC the action makes, so a test can assert which block the reads were pinned to. */
function stubClient(blockNumber: bigint) {
  const requests: Array<{ method: string; params: readonly unknown[] }> = []

  const client = createPublicClient({
    transport: custom({
      request: async ({ method, params }) => {
        requests.push({ method, params: (params ?? []) as readonly unknown[] })

        if (method === 'eth_blockNumber') return numberToHex(blockNumber)

        if (method === 'eth_call') {
          const [call] = params as [{ data: `0x${string}` }]
          if (call.data.startsWith(BALANCE_OF_SELECTOR)) {
            return encodeAbiParameters([{ type: 'uint256' }], [SHARES])
          }
          return encodeAbiParameters(
            [
              {
                type: 'tuple',
                components: [
                  { name: 'asset', type: 'address' },
                  { name: 'value', type: 'uint256' },
                ],
              },
            ],
            [{ asset: USDC, value: SHARES * 2n }],
          )
        }

        throw new Error(`unexpected RPC call: ${method}`)
      },
    }),
  })

  const blockTagsOfCalls = () =>
    requests.filter((request) => request.method === 'eth_call').map((request) => request.params[1])

  return { client, requests, blockTagsOfCalls }
}

describe('getConduitPosition pins both reads to one block', () => {
  test('uses the block it was given, and asks for none', async () => {
    const { client, requests, blockTagsOfCalls } = stubClient(21_000_000n)

    const position = await getConduitPosition(client, {
      conduit: CONDUIT,
      account: ACCOUNT,
      blockNumber: 20_999_000n,
    })

    expect(requests.some((request) => request.method === 'eth_blockNumber')).toBe(false)
    expect(blockTagsOfCalls()).toEqual([numberToHex(20_999_000n), numberToHex(20_999_000n)])
    expect(position.blockNumber).toBe(20_999_000n)
  })

  test('resolves the current block and pins both reads to it', async () => {
    const { client, requests, blockTagsOfCalls } = stubClient(21_000_000n)

    const position = await getConduitPosition(client, { conduit: CONDUIT, account: ACCOUNT })

    expect(requests.filter((request) => request.method === 'eth_blockNumber')).toHaveLength(1)
    expect(blockTagsOfCalls()).toEqual([numberToHex(21_000_000n), numberToHex(21_000_000n)])
    expect(position.blockNumber).toBe(21_000_000n)
    expect(position.shares).toBe(SHARES)
    expect(position.assets).toBe(SHARES * 2n)
  })

  // viem caches the block number for `client.cacheTime` by default. Cached, a read taken right
  // after a receipt would pin to a block from before the transaction it just confirmed.
  test('does not serve the block number from viem cache', async () => {
    const { client, requests } = stubClient(21_000_000n)

    await getConduitPosition(client, { conduit: CONDUIT, account: ACCOUNT })
    await getConduitPosition(client, { conduit: CONDUIT, account: ACCOUNT })

    expect(requests.filter((request) => request.method === 'eth_blockNumber')).toHaveLength(2)
  })
})

describe('conduitPositionQueryOptions', () => {
  test('passes blockNumber through to the action', async () => {
    const { client, requests, blockTagsOfCalls } = stubClient(21_000_000n)

    const { queryFn } = conduitPositionQueryOptions(client, {
      conduit: CONDUIT,
      account: ACCOUNT,
      blockNumber: 20_999_000n,
    })

    const position = await (queryFn as () => Promise<GetConduitPositionReturnType>)()

    expect(requests.some((request) => request.method === 'eth_blockNumber')).toBe(false)
    expect(blockTagsOfCalls()).toEqual([numberToHex(20_999_000n), numberToHex(20_999_000n)])
    expect(position.blockNumber).toBe(20_999_000n)
  })

  test('carries the block into the query key, so a pinned read caches apart', () => {
    const { client } = stubClient(21_000_000n)

    const pinned = conduitPositionQueryOptions(client, {
      conduit: CONDUIT,
      account: ACCOUNT,
      blockNumber: 20_999_000n,
    })
    const live = conduitPositionQueryOptions(client, { conduit: CONDUIT, account: ACCOUNT })

    expect(pinned.queryKey).not.toEqual(live.queryKey)
    expect(pinned.queryKey[2]).toMatchObject({ blockNumber: '20999000' })
  })
})
