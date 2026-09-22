import { describe, expect, it } from 'bun:test'
import {
  type Address,
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeFunctionResult,
} from 'viem'
import { base } from 'viem/chains'
import { baseVehicleAbi } from '../src/abi/baseVehicle.js'
import { getVehicleConversion } from '../src/actions/vehicle/getVehicleConversion.js'

const vehicle: Address = '0x2222222222222222222222222222222222222222'
const usdc: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

describe('getVehicleConversion', () => {
  it('passes the asset and direction to convert and returns its result', async () => {
    const seen: { to?: string; args?: readonly unknown[] } = {}
    const client = createPublicClient({
      chain: base,
      transport: custom({
        request: async ({ method, params }) => {
          if (method !== 'eth_call') throw new Error(`unexpected ${method}`)
          const call = (params as [{ to: string; data: `0x${string}` }])[0]
          seen.to = call.to
          seen.args = decodeFunctionData({ abi: baseVehicleAbi, data: call.data }).args
          return encodeFunctionResult({
            abi: baseVehicleAbi,
            functionName: 'convert',
            result: { asset: usdc, value: 1_050_000n },
          })
        },
      }),
    })

    const converted = await getVehicleConversion(client, {
      vehicle,
      asset: { asset: vehicle, value: 10n ** 18n },
      sharesToAssets: true,
    })

    expect(converted).toEqual({ asset: usdc, value: 1_050_000n })
    expect(seen.to).toBe(vehicle.toLowerCase())
    expect(seen.args).toEqual([{ asset: vehicle, value: 10n ** 18n }, true])
  })
})
