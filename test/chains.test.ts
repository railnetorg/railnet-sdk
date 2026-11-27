import { describe, expect, it } from 'bun:test'
import { base, mainnet, sepolia } from 'viem/chains'
import { addresses } from '../src/contracts/addresses.js'
import { getAddresses, isSupportedChain } from '../src/contracts/chains.js'
import {
  getAddresses as getStagingAddresses,
  isSupportedChain as isSupportedStagingChain,
  addresses as stagingAddresses,
} from '../src/staging/index.js'

describe('production addresses', () => {
  it('supports both Ethereum and Base', () => {
    expect(isSupportedChain(mainnet.id)).toBe(true)
    expect(isSupportedChain(base.id)).toBe(true)
  })

  it('returns addresses for every supported chain', () => {
    for (const chainId of Object.keys(addresses).map(Number)) {
      expect(getAddresses(chainId)).toBe(addresses[chainId as keyof typeof addresses])
    }
  })

  it('names the supported chains in the error', () => {
    expect(() => getAddresses(sepolia.id)).toThrowError(`Supported: ${mainnet.id}, ${base.id}`)
  })
})

describe('staging addresses', () => {
  it('supports both Ethereum and Base', () => {
    expect(isSupportedStagingChain(mainnet.id)).toBe(true)
    expect(isSupportedStagingChain(base.id)).toBe(true)
  })

  it('returns addresses for every supported chain', () => {
    for (const chainId of Object.keys(stagingAddresses).map(Number)) {
      expect(getStagingAddresses(chainId)).toBe(
        stagingAddresses[chainId as keyof typeof stagingAddresses],
      )
    }
  })

  it('throws for a chain with no staging deployment', () => {
    expect(() => getStagingAddresses(sepolia.id)).toThrowError(
      `Unsupported staging chain: ${sepolia.id}`,
    )
  })
})

describe('the two entry points are different deployments', () => {
  it('ships a different deployment in each, on Ethereum and on Base', () => {
    for (const chainId of [mainnet.id, base.id]) {
      const production = getAddresses(chainId)
      const staging = getStagingAddresses(chainId)
      const shared = Object.entries(production)
        .filter(([key, value]) => staging[key as keyof typeof staging] === value)
        .map(([key]) => key)
      expect(shared).toEqual(['aavePoolAddressesProvider', 'usdc'])
    }
  })
})
