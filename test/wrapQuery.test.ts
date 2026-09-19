import { describe, expect, it } from 'bun:test'
import {
  type Address,
  createPublicClient,
  custom,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem'
import { base } from 'viem/chains'
import { buildWrapQueryCall, getQueryClaim, ownerRegistryAbi, QueryMode } from '../src/index.js'
import type { Query } from '../src/types.js'

const ownerRegistry: Address = '0x1111111111111111111111111111111111111111'
const conduit: Address = '0x2222222222222222222222222222222222222222'
const owner: Address = '0xd2135CfB216b74109775236E36d4b433F1DF507B'
const USDC: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

const query: Query = {
  owner,
  receiver: owner,
  input: { asset: USDC, value: 1_000_000n },
  output: { asset: USDC, value: 0n },
  mode: QueryMode.REDEEM,
  salt: zeroHash,
  data: '0x',
}

function claimClient(results: readonly [Address, boolean, bigint]) {
  return createPublicClient({
    chain: base,
    transport: custom({
      request: async ({ method }) => {
        if (method === 'eth_chainId') return `0x${base.id.toString(16)}`
        if (method !== 'eth_call') throw new Error(`unexpected ${method}`)

        const encoded = [
          encodeAbiParameters([{ type: 'address' }], [results[0]]),
          encodeAbiParameters([{ type: 'bool' }], [results[1]]),
          encodeAbiParameters([{ type: 'uint256' }], [results[2]]),
        ].map((returnData) => ({ success: true, returnData }))

        return encodeAbiParameters(
          [
            {
              type: 'tuple[]',
              components: [
                { name: 'success', type: 'bool' },
                { name: 'returnData', type: 'bytes' },
              ],
            },
          ],
          [encoded],
        )
      },
    }),
  })
}

describe('buildWrapQueryCall', () => {
  it('sends the query and its conduit to the registry', () => {
    const prepared = buildWrapQueryCall({ ownerRegistry, query, conduit })

    expect(prepared.address).toBe(ownerRegistry)
    expect(prepared.abi).toBe(ownerRegistryAbi)
    expect(prepared.functionName).toBe('wrap')
    expect(prepared.args).toEqual([query, conduit])
  })
})

describe('getQueryClaim', () => {
  it('reports a registered, unwrapped claim', async () => {
    const claim = await getQueryClaim(claimClient([owner, false, 0n]), {
      ownerRegistry,
      conduit,
      queryId: zeroHash,
    })

    expect(claim).toEqual({ owner, isWrapped: false, tokenId: 0n })
  })

  /**
   * `wrap` clears `owner` and sets `tokenId`, so a zero owner means two different things depending
   * on `isWrapped`: the NFT holder owns the claim, or the registry never knew the query.
   */
  it('distinguishes a wrapped claim from an unknown one', async () => {
    const wrapped = await getQueryClaim(claimClient([zeroAddress, true, 7n]), {
      ownerRegistry,
      conduit,
      queryId: zeroHash,
    })
    expect(wrapped).toEqual({ owner: zeroAddress, isWrapped: true, tokenId: 7n })

    const unknown = await getQueryClaim(claimClient([zeroAddress, false, 0n]), {
      ownerRegistry,
      conduit,
      queryId: zeroHash,
    })
    expect(unknown).toEqual({ owner: zeroAddress, isWrapped: false, tokenId: 0n })
  })
})
