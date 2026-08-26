import { addresses, type ChainAddresses, type SupportedChainId } from './addresses.js'

/**
 * Returns whether a chain ID is supported by the Railnet protocol: Ethereum (1) and Base (8453).
 * @returns `true` if the chain is supported, with type narrowing to `SupportedChainId`
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses
}

/**
 * Returns the Railnet contract addresses for a given chain ID. Throws if the chain is not supported.
 * @throws Error if the chain ID is not supported
 *
 * @example
 * import { getAddresses } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { conduitFactory, assetRegistry, usdc } = getAddresses(base.id)
 */
export function getAddresses(chainId: number): ChainAddresses {
  if (!isSupportedChain(chainId)) {
    const supported = Object.keys(addresses).join(', ')
    throw new Error(`Unsupported chain: ${chainId}. Supported: ${supported}`)
  }
  return addresses[chainId]
}
