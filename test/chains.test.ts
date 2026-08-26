import { describe, expect, it } from 'bun:test'
import { getAddress } from 'viem'
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

describe('addresses', () => {
  const chainIds = Object.keys(addresses).map(Number)

  it('gives every chain the same set of keys', () => {
    const reference = Object.keys(getAddresses(base.id)).sort()
    for (const chainId of chainIds) {
      expect(Object.keys(getAddresses(chainId)).sort()).toEqual(reference)
    }
  })

  it.each(chainIds)('chain %i is checksummed and free of duplicates', (chainId) => {
    const entries = Object.entries(getAddresses(chainId))

    for (const [key, address] of entries) {
      expect(address, key).toBe(getAddress(address))
      expect(address, key).not.toBe('0x0000000000000000000000000000000000000000')
    }

    expect(new Set(entries.map(([, address]) => address)).size).toBe(entries.length)
  })

  // Circle's and Aave's, so unlike the protocol addresses they are not transcribed from a contracts
  // deployment file and nothing else in the repo corroborates them.
  it('pins the external addresses', () => {
    expect(getAddresses(base.id).usdc).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
    expect(getAddresses(base.id).aavePoolAddressesProvider).toBe(
      '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    )
    expect(getAddresses(mainnet.id).usdc).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
    expect(getAddresses(mainnet.id).aavePoolAddressesProvider).toBe(
      '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    )
  })
})
