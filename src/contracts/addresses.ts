import type { Address } from 'viem'

export type ChainAddresses = {
  conduitFactory: Address
  coreFactory: Address
  multiVehicleFactory: Address
  aaveV3VehicleFactory: Address
  erc4626VehicleFactory: Address
  morphoBlueVehicleFactory: Address
  wrapperVehicleFactory: Address
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
  8453: {
    conduitFactory: '0xB5Fa1934Daf1B06b1Ab80241Fa71BD49F5adc5bb',
    coreFactory: '0x4d56134e9beC2bD5eEbff7BC47794Ac829BA7ED0',
    multiVehicleFactory: '0x7Bb6D12Ecd0e93DEFfdB401FabEF76Af24eb1ac5',
    aaveV3VehicleFactory: '0x546Fa2BA7457911832fED2C26FB9a37EbAAa9061',
    erc4626VehicleFactory: '0x2341e0AbA453A7F450Aab5F30c390209E97B1E75',
    morphoBlueVehicleFactory: '0x620269cbFE8E64d08E8Aaf90F89106288aEd9e3E',
    wrapperVehicleFactory: '0x9b819B26a8B124B4Eb150994F995123162E665dA',
    eacFactory: '0x97C15A31Ea128bFDe4e5e9826eA47cCbC4f6d289',
    adminEac: '0x559D03f0A3fA192344da23fEfC07f5e7c6994B1f',
    feeManagerFactory: '0xE521AA8eb221Ec9cF09A86B44018CaBA728ce84b',
    modulesManagerFactory: '0x6BDe2385042D7b332aa8537c187d80b4aa5d54E6',
    accountListFactory: '0x473A97c9DD9Bf77b017aAB664D42c2FDf381E6ce',
    ownerRegistryFactory: '0x9E3B6838134D5e5d310492c3d90714235EcE106B',
    assetRegistry: '0x9133CCe08893D92b816f5cF8aAfa57839B9F7f5a',
    queryRegistry: '0x48298Bf0406E39764c842e5F4a01f53B7E2d057F',
    aavePoolAddressesProvider: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses
