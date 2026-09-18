import { describe, expect, it } from 'bun:test'
import {
  type Address,
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeAbiParameters,
} from 'viem'
import { base } from 'viem/chains'
import { conduitAbi } from '../src/abi/conduit.js'
import { getIsTransferable } from '../src/actions/conduit/getIsTransferable.js'

const conduit: Address = '0x1111111111111111111111111111111111111111'
const from: Address = '0x2Ec94b8979868bF5586f8550733092a77Cd77C9E'
const to: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

function capturingClient(transferable: boolean) {
  const seen: { address?: string; from?: string; to?: string } = {}

  const client = createPublicClient({
    chain: base,
    transport: custom({
      request: async ({ method, params }) => {
        if (method === 'eth_chainId') return `0x${base.id.toString(16)}`
        if (method !== 'eth_call') throw new Error(`unexpected ${method}`)

        const call = (params as [{ to: string; data: `0x${string}` }])[0]
        const { args } = decodeFunctionData({ abi: conduitAbi, data: call.data })
        const [fromArg, toArg] = args as [string, string]
        seen.address = call.to
        seen.from = fromArg
        seen.to = toArg

        return encodeAbiParameters([{ type: 'bool' }], [transferable])
      },
    }),
  })

  return { client, seen }
}

describe('getIsTransferable', () => {
  it('passes the pair through as from then to', async () => {
    const { client, seen } = capturingClient(true)

    const transferable = await getIsTransferable(client, { conduit, from, to })

    expect(transferable).toBe(true)
    expect(seen.address?.toLowerCase()).toBe(conduit.toLowerCase())
    expect(seen.from?.toLowerCase()).toBe(from.toLowerCase())
    expect(seen.to?.toLowerCase()).toBe(to.toLowerCase())
  })

  it('does not fold the pair into one argument', async () => {
    const { client, seen } = capturingClient(false)

    const transferable = await getIsTransferable(client, { conduit, from: to, to: from })

    expect(transferable).toBe(false)
    expect(seen.from?.toLowerCase()).toBe(to.toLowerCase())
    expect(seen.to?.toLowerCase()).toBe(from.toLowerCase())
  })
})
