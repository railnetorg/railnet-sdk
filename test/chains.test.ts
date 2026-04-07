import { describe, expect, it } from 'bun:test'
import { base, sepolia } from 'viem/chains'
import { addresses } from '../src/contracts/addresses.js'
import { getAddresses, isSupportedChain } from '../src/contracts/chains.js'

describe('isSupportedChain', () => {
  it('returns true for Base', () => {
    expect(isSupportedChain(base.id)).toBe(true)
  })

  it('returns false for unsupported chain', () => {
    expect(isSupportedChain(sepolia.id)).toBe(false)
  })
})

describe('getAddresses', () => {
  it('returns addresses for Base', () => {
    const result = getAddresses(base.id)
    expect(result).toBe(addresses[base.id])
    expect(result.conduitFactory).toBe('0x45295185BB8a8853996D65ba28c24bF7F3F1e9D0')
    expect(result.usdc).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
  })

  it('throws for unsupported chain', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(`Unsupported chain: ${sepolia.id}`)
  })

  it('includes supported chain IDs in error message', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(base.id.toString())
  })
})
