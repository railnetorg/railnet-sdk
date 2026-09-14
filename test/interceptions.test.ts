import { describe, expect, it } from 'bun:test'
import { type Address, zeroAddress } from 'viem'
import {
  assertInterceptions,
  baseVehicleAbi,
  buildSetConduitInterceptionsCall,
  buildSetVehicleInterceptionsCall,
  conduitAbi,
} from '../src/index.js'

const conduit: Address = '0x1111111111111111111111111111111111111111'
const vehicle: Address = '0x2222222222222222222222222222222222222222'
const target: Address = '0x3333333333333333333333333333333333333333'

const split = (...shares: bigint[]) => [
  {
    asset: zeroAddress,
    recipients: shares.map((shareBps) => ({ target, shareBps, chainId: 0n })),
  },
]

describe('assertInterceptions', () => {
  // The contract only rejects a sum ABOVE 10000, unlike a fee split which must hit it exactly.
  it('accepts a split that falls short of 10000 bps', () => {
    expect(() => assertInterceptions(split(3_000n, 4_000n))).not.toThrow()
  })

  it('accepts a split that lands exactly on 10000 bps', () => {
    expect(() => assertInterceptions(split(6_000n, 4_000n))).not.toThrow()
  })

  it('rejects a split above 10000 bps', () => {
    expect(() => assertInterceptions(split(6_000n, 5_000n))).toThrow('must not exceed')
  })

  it('accepts an empty list, which clears every rule', () => {
    expect(() => assertInterceptions([])).not.toThrow()
  })
})

describe('interception builders', () => {
  it('targets the conduit with the conduit ABI', () => {
    const prepared = buildSetConduitInterceptionsCall({ conduit, interceptions: split(10_000n) })

    expect(prepared.address).toBe(conduit)
    expect(prepared.abi).toBe(conduitAbi)
    expect(prepared.functionName).toBe('setInterceptions')
  })

  it('targets the vehicle with the vehicle ABI', () => {
    const prepared = buildSetVehicleInterceptionsCall({ vehicle, interceptions: split(10_000n) })

    expect(prepared.address).toBe(vehicle)
    expect(prepared.abi).toBe(baseVehicleAbi)
    expect(prepared.functionName).toBe('setInterceptions')
  })

  it('refuses to build an over-allocated split on either side', () => {
    expect(() =>
      buildSetConduitInterceptionsCall({ conduit, interceptions: split(10_001n) }),
    ).toThrow('must not exceed')
    expect(() =>
      buildSetVehicleInterceptionsCall({ vehicle, interceptions: split(10_001n) }),
    ).toThrow('must not exceed')
  })

  it('checks each interception on its own, not the total across assets', () => {
    const perAsset = [
      { asset: zeroAddress, recipients: [{ target, shareBps: 10_000n, chainId: 0n }] },
      { asset: target, recipients: [{ target, shareBps: 10_000n, chainId: 0n }] },
    ]

    expect(() =>
      buildSetConduitInterceptionsCall({ conduit, interceptions: perAsset }),
    ).not.toThrow()
  })
})
