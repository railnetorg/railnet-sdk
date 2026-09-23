import { describe, expect, it } from 'bun:test'
import {
  type Address,
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeAbiParameters,
} from 'viem'
import { base } from 'viem/chains'
import { sectorAccountingEngineAbi } from '../src/abi/sectorAccountingEngine.js'
import { getSectorBalance } from '../src/actions/multiVehicle/getSectorBalance.js'
import { vehicleSector } from '../src/constants/sectors.js'

const sectorAccountingEngine: Address = '0x1111111111111111111111111111111111111111'
const vehicle: Address = '0x2Ec94b8979868bF5586f8550733092a77Cd77C9E'
const asset: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

function capturingClient(balance: bigint) {
  const seen: { sector?: string; asset?: string } = {}

  const client = createPublicClient({
    chain: base,
    transport: custom({
      request: async ({ method, params }) => {
        if (method === 'eth_chainId') return `0x${base.id.toString(16)}`
        if (method !== 'eth_call') throw new Error(`unexpected ${method}`)

        const { args } = decodeFunctionData({
          abi: sectorAccountingEngineAbi,
          data: (params as [{ data: `0x${string}` }])[0].data,
        })
        const [sector, assetArg] = args as [string, string]
        seen.sector = sector
        seen.asset = assetArg

        return encodeAbiParameters([{ type: 'uint256' }], [balance])
      },
    }),
  })

  return { client, seen }
}

describe('getSectorBalance', () => {
  it('passes the sector and asset through in that order', async () => {
    const { client, seen } = capturingClient(42n)

    const balance = await getSectorBalance(client, {
      sectorAccountingEngine,
      sector: vehicleSector(vehicle),
      asset,
    })

    expect(balance).toBe(42n)
    expect(seen.sector).toBe(vehicleSector(vehicle))
    expect(seen.asset?.toLowerCase()).toBe(asset.toLowerCase())
  })
})
