import { addresses, type ChainAddresses, type SupportedChainId } from './addresses.js'

/**
 * Returns whether a chain has a Railnet production deployment.
 * Staging deployments live behind `@railnetorg/railnet-sdk/staging` and are not counted here.
 * @returns `true` if the chain is supported, with type narrowing to `SupportedChainId`
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses
}

/**
 * Returns the production addresses for a chain. Throws if the chain has no production deployment.
 * @throws Error if the chain ID is not supported
 *
 * @example
 * import { getAddresses } from '@railnetorg/railnet-sdk'
 * import { mainnet } from 'viem/chains'
 *
 * const { conduitFactory, assetRegistry, usdc } = getAddresses(mainnet.id)
 */
export function getAddresses(chainId: number): ChainAddresses {
  if (!isSupportedChain(chainId)) {
    const supported = Object.keys(addresses).join(', ')
    throw new Error(`Unsupported chain: ${chainId}. Supported: ${supported}`)
  }
  return addresses[chainId]
}
