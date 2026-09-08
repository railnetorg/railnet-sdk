import type { Address } from 'viem'

export type ChainAddresses = {
  /** Block the deployment started at — where an indexer or a log scan should begin. */
  startedAtBlock: bigint
  conduitFactory: Address
  coreFactory: Address
  multiVehicleFactory: Address
  aaveV3VehicleFactory: Address
  erc4626VehicleFactory: Address
  morphoBlueVehicleFactory: Address
  /** Absent where the deployment ships no wrapper vehicle. */
  wrapperVehicleFactory?: Address
  eacFactory: Address
  adminEac: Address
  feeManagerFactory: Address
  modulesManagerFactory: Address
  accountListFactory: Address
  ownerRegistryFactory: Address
  assetRegistry: Address
  queryRegistry: Address
  aavePoolAddressesProvider: Address
  usdc: Address
}

/**
 * Production deployments. Base is not here yet: its production deployment has not shipped, and the
 * staging one it runs today is behind `@railnetorg/railnet-sdk/staging` rather than passed off as
 * production under chain 8453.
 */
export const addresses = {
  1: {
    startedAtBlock: 25882737n,
    conduitFactory: '0x9A103cf026824Af04395e09516e68D96fcE6DC7a',
    coreFactory: '0xD9dBc05A44f8109b1f6a6e96Fac74623871F4633',
    multiVehicleFactory: '0x8f69CAF97c17a482Fc03C06E1C879a91Db07cFDB',
    aaveV3VehicleFactory: '0x35672A7D07E9F3e4eCEA31f61A88CAe4d1A913d4',
    erc4626VehicleFactory: '0x708F06B8D98075E6Feeb8E5A4DbFF1bB045D1F6d',
    morphoBlueVehicleFactory: '0xFebD3ca7e01285e27299c7001307a3D64186Aa49',
    eacFactory: '0xdCF574FB2198764F9d96c83b06E137358768FdF2',
    adminEac: '0x6738cf7518363b9B122258E13b16F3815ebe0138',
    feeManagerFactory: '0x296B410D82ff467Fe60fd2137784517be701Ab77',
    modulesManagerFactory: '0xEe3fabccEb513Ea7A35722646C24bd7bC52C2BF8',
    accountListFactory: '0x29c41AA3dD96C0940952bA5a7D66141E7fc7B02d',
    ownerRegistryFactory: '0xc3dD54abB207e00C9c1856f802BB33ce2598B566',
    assetRegistry: '0x7a3263Aa3A084881705E6a71AebBFb3176Ed8005',
    queryRegistry: '0x69D9c06b318dAd03872a119Cb4a8db3600b21cE0',
    aavePoolAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses
