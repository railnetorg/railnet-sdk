import type { Address } from 'viem'

export type ChainAddresses = {
  /** Block the deployment started at, where an indexer or a log scan begins. */
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

/** Production deployments. Staging ones are behind `@railnetorg/railnet-sdk/staging`. */
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
  8453: {
    startedAtBlock: 53542510n,
    conduitFactory: '0xdf34405032fd393798Ac2e86f519CE23c2dDb1D8',
    coreFactory: '0x1191334d565b76Ff0d8F6ffC64723e1424580289',
    multiVehicleFactory: '0xb1Ea3dA7629822d4ECeE9B48bf811d70F6B559a0',
    aaveV3VehicleFactory: '0x716Ae923b1926CA6Bbf6a667ed8F40A9b42b354A',
    erc4626VehicleFactory: '0xAA70d5Fe2d9eb0c219CB468589bf4Bb4C9b392b5',
    morphoBlueVehicleFactory: '0x1984649782FB357114f28c701C89a2E407216D9d',
    eacFactory: '0x304a5d2F1eC3b1A24390CA817B004b411a99718e',
    adminEac: '0xb31Cb80fc37A7b10241397767e9AB35FD648d6a7',
    feeManagerFactory: '0x876b2Ce1ff5d26d1Df4456DFFBf0F68684336324',
    modulesManagerFactory: '0x0700bEE41E336ae32BBC476DAA5ced0854367250',
    accountListFactory: '0x22aE5772bCF616DFF1439aD54Acc9d1FF76876DE',
    ownerRegistryFactory: '0x509409921702056D8b556468468A2b64712B9543',
    assetRegistry: '0x1D7ec5f1497cEA05863a09dC29d6AD20053E50A8',
    queryRegistry: '0x4bbA9e87bC85901Cf9A0deb5143427C4Ce4FA403',
    aavePoolAddressesProvider: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses
