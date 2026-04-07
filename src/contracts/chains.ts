import { addresses, type ChainAddresses, type SupportedChainId } from './addresses.js'

/**
 * Returns whether a chain ID is supported by the Railnet protocol. Currently only Base (8453).
 * @param chainId - The chain ID to check
 * @returns `true` if the chain is supported, with type narrowing to `SupportedChainId`
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses
}

/**
 * Returns the Railnet contract addresses for a given chain ID. Throws if the chain is not supported.
 * @param chainId - The chain ID to look up
 * @returns All Railnet contract addresses for the chain
 * @throws Error if the chain ID is not supported
 */
export function getAddresses(chainId: number): ChainAddresses {
  if (!isSupportedChain(chainId)) {
    const supported = Object.keys(addresses).join(', ')
    throw new Error(`Unsupported chain: ${chainId}. Supported: ${supported}`)
  }
  return addresses[chainId]
}
