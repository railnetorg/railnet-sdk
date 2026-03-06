import { addresses, type ChainAddresses, type SupportedChainId } from './addresses.js'

export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses
}

export function getAddresses(chainId: number): ChainAddresses {
  if (!isSupportedChain(chainId)) {
    const supported = Object.keys(addresses).join(', ')
    throw new Error(`Unsupported chain: ${chainId}. Supported: ${supported}`)
  }
  return addresses[chainId]
}
