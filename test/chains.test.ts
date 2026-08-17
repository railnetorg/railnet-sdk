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
    expect(result.conduitFactory).toBe('0xB5Fa1934Daf1B06b1Ab80241Fa71BD49F5adc5bb')
    expect(result.assetRegistry).toBe('0x9133CCe08893D92b816f5cF8aAfa57839B9F7f5a')
    expect(result.queryRegistry).toBe('0x48298Bf0406E39764c842e5F4a01f53B7E2d057F')
    expect(result.usdc).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
  })

  it('every address is a checksummable 20-byte hex address', () => {
    for (const address of Object.values(getAddresses(base.id))) {
      expect(address).toMatch(/^0x[0-9a-fA-F]{40}$/)
    }
  })

  it('throws for unsupported chain', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(`Unsupported chain: ${sepolia.id}`)
  })

  it('includes supported chain IDs in error message', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(base.id.toString())
  })
})
