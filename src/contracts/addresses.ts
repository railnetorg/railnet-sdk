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
  // contracts deployments/mainnet_testnet.json (slug mainnet_testnet)
  1: {
    conduitFactory: '0x9AC272220546F1A6B5E9ec1a4b6f5E81A3acCdc0',
    coreFactory: '0x4E56Bab92f639a7A7e8D0ADaC192aeb55448e3B8',
    multiVehicleFactory: '0xe6a8b3Fa06a5aEE915915e90b745b21a964f14d5',
    aaveV3VehicleFactory: '0x2A6EB112FEde1e19fa652E2Cc4863Ed3AABAD06d',
    erc4626VehicleFactory: '0xD97cf4B5116cA5c69d96422562bDDBF32974d7BC',
    morphoBlueVehicleFactory: '0xc933f0a59BB0104Aed5E9A34Abbe6bcE7B89a611',
    wrapperVehicleFactory: '0xdb93E6868C6E9cC8bbA07D3Cd9C81CAa500ECFE7',
    eacFactory: '0x0Dcc157067C0E2e51fa49c2E034d839591917De1',
    adminEac: '0x5CD0Da418526150271aA6807b35de9414ce8b153',
    feeManagerFactory: '0xf3227315C4037b6cb123Ea47dB7eA218244B6f15',
    modulesManagerFactory: '0x8D57Da48486FC95cA19B208287E4Ef8E090174b5',
    accountListFactory: '0x76c597F4780C160DF30214B931C1DB1a14337bAb',
    ownerRegistryFactory: '0x6195a96c96Fac8B34f3111EC3EE01cAb5Eecfd26',
    assetRegistry: '0x9e91a8964c9A43cC2F21FFE1c6FD3A6C1233F132',
    queryRegistry: '0xc91E1CE12fEed8754c525374B5a09B51A758C555',
    aavePoolAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  // contracts deployments/base_testnet.json (slug base_testnet)
  8453: {
    conduitFactory: '0x36Fbc89D0d2bFCc333e0075bd73c6A4dFcBA121A',
    coreFactory: '0xd9F9a04ebC252743900c2639b2B6eb3532aeb22C',
    multiVehicleFactory: '0x953AE264B5756E665C6620b61d62327f9856cFB9',
    aaveV3VehicleFactory: '0x422a30120F484545b13d45747c82F152b9163D5a',
    erc4626VehicleFactory: '0xdc8D4C06E139084Fa3b6e3d3E7A3D492Da78c05B',
    morphoBlueVehicleFactory: '0x0482823F8731650fdb15c5f9f6943eFe0B4Fe646',
    wrapperVehicleFactory: '0xb6Bce9ad06e26a7879dd6B6f1C39fA26E629dfa8',
    eacFactory: '0x1B5a21Ae2926f5a12d8fe158F2431A994caAB9c6',
    adminEac: '0x18d222014FFa4868e4D6Fd636C8444d08335e753',
    feeManagerFactory: '0xBCf825C597327E8941e945DE2a9e4A6C4C404cAc',
    modulesManagerFactory: '0xf21760462F7c343BE6F19aaf748A424C56A84D18',
    accountListFactory: '0xA9CfcC61C861ABCe6DeF145FF81EcAd20846795C',
    ownerRegistryFactory: '0xd0ff2C05dc2BC0129ED44d7395Cdb342F8222436',
    assetRegistry: '0xefdB0D96F9dce67b95200E9D9be46e0fA18b7042',
    queryRegistry: '0x0158ea4a1d2858AE6C11baD2e1374E3F10A24024',
    aavePoolAddressesProvider: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const satisfies Record<number, ChainAddresses>

export type SupportedChainId = keyof typeof addresses
