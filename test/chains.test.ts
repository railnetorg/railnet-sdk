import { describe, expect, it } from 'bun:test'
import { base, mainnet, sepolia } from 'viem/chains'
import { addresses } from '../src/contracts/addresses.js'
import { getAddresses, isSupportedChain } from '../src/contracts/chains.js'

describe('isSupportedChain', () => {
  it('returns true for Base', () => {
    expect(isSupportedChain(base.id)).toBe(true)
  })

  it('returns true for Ethereum', () => {
    expect(isSupportedChain(mainnet.id)).toBe(true)
  })

  it('returns false for unsupported chain', () => {
    expect(isSupportedChain(sepolia.id)).toBe(false)
  })
})

describe('getAddresses', () => {
  it('returns addresses for every supported chain', () => {
    for (const chainId of Object.keys(addresses).map(Number)) {
      expect(getAddresses(chainId)).toBe(addresses[chainId as keyof typeof addresses])
    }
  })

  it('throws for unsupported chain', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(`Unsupported chain: ${sepolia.id}`)
  })

  it('includes supported chain IDs in error message', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(base.id.toString())
  })
})
