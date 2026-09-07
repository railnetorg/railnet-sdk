import type { Address } from 'viem'

export type ChainAddresses = {
  conduitFactory: Address
  coreFactory: Address
  multiVehicleFactory: Address
  aaveV3VehicleFactory: Address
  erc4626VehicleFactory: Address
  morphoBlueVehicleFactory: Address
  /** Absent on Ethereum mainnet: the production deployment ships no wrapper vehicle factory. */
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

export const addresses = {
  1: {
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
