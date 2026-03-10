import type { Address } from 'viem'

export type ChainAddresses = {
  conduitFactory: Address
  coreFactory: Address
  multiVehicleFactory: Address
  aaveV3VehicleFactory: Address
  compoundV3VehicleFactory: Address
  erc4626VehicleFactory: Address
  morphoBlueVehicleFactory: Address
  wrapperVehicleFactory: Address
  eacFactory: Address
  adminEac: Address
  feeManagerFactory: Address
  modulesManagerFactory: Address
  accountListFactory: Address
  ownerRegistryFactory: Address
  aavePoolAddressesProvider: Address
  aaveV3Vehicle: Address
  usdc: Address
}

export const addresses = {
  8453: {
    conduitFactory: '0x45295185BB8a8853996D65ba28c24bF7F3F1e9D0',
    coreFactory: '0xe77e77285F9cf8f2D89A4916ca03ddf7E3aB8F05',
    multiVehicleFactory: '0xA5BEcaAFf0524dB1D78deBD2eEF492dB7c53af58',
    aaveV3VehicleFactory: '0x414A9F508044B914243e91a421bf2F7D599aDc78',
    compoundV3VehicleFactory: '0x33450Ec8C1b1BEbD4eEe39714b5C0e18b90d0f33',
    erc4626VehicleFactory: '0x75074d971c62B82BA8baf316dE5c4E17eBbe9cb5',
    morphoBlueVehicleFactory: '0x305844AD370e202e534c80b14c2a03e00369267d',
    wrapperVehicleFactory: '0x7567FA3332a284A96b936ed8F756F03799885EC5',
    eacFactory: '0xE7B6AE6A28B80194F104779F548601f99104a7DE',
    adminEac: '0xfC27449b53E52F2fC9fd667f3bAF56Cc71f8f7A5',
    feeManagerFactory: '0xe16B75aBa268d2F64a13F5CD88878A78C9c71D65',
    modulesManagerFactory: '0xca2C29Eb8f27498fd9B4906a2960c6cC13539a8f',
    accountListFactory: '0xE390a2A1B8189B34D5bB00D363DF70904ed729f2',
    ownerRegistryFactory: '0xfDEC8Dc8BB04280d72794B8F18701e3CE6A59136',
    aavePoolAddressesProvider: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    // TODO: fill with deployed Aave V3 vehicle address
    aaveV3Vehicle: '0x0000000000000000000000000000000000000000',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses
