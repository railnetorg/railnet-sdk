import type { ChainAddresses } from '../contracts/addresses.js'

export type { ChainAddresses }

/**
 * Staging deployments, which run on real mainnet chain ids rather than on a testnet — chain 8453
 * here is Base mainnet. They are a separate entry point so that importing the package cannot reach
 * them by accident: a partner integrating against the root never sees these.
 */
export const addresses = {
  1: {
    startedAtBlock: 25883509n,
    conduitFactory: '0x93D196eb87e683acfbfa423CaC0eAd6a6e497600',
    coreFactory: '0x9BA9A04eA867596C34987e0dD6d0F61C5d05463D',
    multiVehicleFactory: '0x23EeE3C74Be85F7baeE847D79E696213B4a54687',
    aaveV3VehicleFactory: '0xAf7305b45C9D09ed04D40a7a254F9cD45C3DEc84',
    erc4626VehicleFactory: '0x1176181D73cD10A0e9e991Ff3a7551522b1b0437',
    morphoBlueVehicleFactory: '0x5F50eBfCFE9bbeE633A5eb4E82661606bCcd86e8',
    wrapperVehicleFactory: '0x1D7ec5f1497cEA05863a09dC29d6AD20053E50A8',
    eacFactory: '0xD0ab5E1C64ce534A6000Fc331ec2D0688d025bFd',
    adminEac: '0x97fFE39C94Fc6316730F2A523d63aBDd64882051',
    feeManagerFactory: '0x0b7B73c37dBEE61471432d023389039167880F00',
    modulesManagerFactory: '0x98bc1c818caA1b23219887DFeBc6CAAfb26e894d',
    accountListFactory: '0x58FAC4afF751A8ef22b8b393a73CCcFbb2D50870',
    ownerRegistryFactory: '0x313742D14F4e838f3684c3714408bC4Bcb411806',
    assetRegistry: '0xa2353277C57C8De726DEaeA0699a65895Fc31d7E',
    queryRegistry: '0x599599BB3B63dB95d96EC5CBCc5C240582f3f50b',
    aavePoolAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  8453: {
    startedAtBlock: 50745998n,
    conduitFactory: '0xe32C8c7dAd1fCf776dfC7f5897A7FA64Bee0B927',
    coreFactory: '0x19568D46f3cA6CF265bD865dcCE027EF2f2F99dF',
    multiVehicleFactory: '0x704F7701688c2cAe5D9735396494C75ce217dA8e',
    aaveV3VehicleFactory: '0x7a3263Aa3A084881705E6a71AebBFb3176Ed8005',
    erc4626VehicleFactory: '0xD00134FD8Ad9A106E984E992f66E1a16B48ca286',
    morphoBlueVehicleFactory: '0x9eE4AA99858cE24a54fceF8508f0aE3728c2C9e7',
    wrapperVehicleFactory: '0x9943d82bD6d9619BB22be62595Db5ae2906A6d6C',
    eacFactory: '0xc4D6d9d3ae5140e0182CFD790Ad2Fc8e558993f2',
    adminEac: '0xA7d48267F8245c25B682a22F31C6B8335C4944D8',
    feeManagerFactory: '0xdCF574FB2198764F9d96c83b06E137358768FdF2',
    modulesManagerFactory: '0xA6534a2E7CfEd3857A550bfCDbc39d01DA111a12',
    accountListFactory: '0x9A103cf026824Af04395e09516e68D96fcE6DC7a',
    ownerRegistryFactory: '0xD0ab5E1C64ce534A6000Fc331ec2D0688d025bFd',
    assetRegistry: '0x296B410D82ff467Fe60fd2137784517be701Ab77',
    queryRegistry: '0x7A6C0948373d96F9000D3DF6287aeFaA92AA0d24',
    aavePoolAddressesProvider: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses

/**
 * Returns whether a chain has a staging deployment.
 * @returns `true` if it does, with type narrowing to {@link SupportedChainId}
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses
}

/**
 * Returns the staging addresses for a chain. Throws if the chain has no staging deployment.
 * @throws Error if the chain is not supported
 */
export function getAddresses(chainId: number): ChainAddresses {
  if (!isSupportedChain(chainId)) {
    const supported = Object.keys(addresses).join(', ')
    throw new Error(`Unsupported staging chain: ${chainId}. Supported: ${supported}`)
  }
  return addresses[chainId]
}
