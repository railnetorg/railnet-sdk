import type { Address } from 'viem'
// Base runs the staging deployment: chain 8453 has no production one yet.
import { addresses } from '../src/staging/index.js'

export const BASE_CHAIN_ID = 8453
export const BASE_ADDRESSES = addresses[BASE_CHAIN_ID]

export const USDC: Address = BASE_ADDRESSES.usdc
export const CONDUIT_FACTORY: Address = BASE_ADDRESSES.conduitFactory
export const MULTI_VEHICLE_FACTORY: Address = BASE_ADDRESSES.multiVehicleFactory
export const EAC_FACTORY: Address = BASE_ADDRESSES.eacFactory
export const AAVE_V3_VEHICLE_FACTORY: Address = BASE_ADDRESSES.aaveV3VehicleFactory
export const ASSET_REGISTRY: Address = BASE_ADDRESSES.assetRegistry

// Spawned by the superseded factory generation, so the shipped ConduitFactory disowns it. The
// Conduit surface is identical across generations, so the behavioural tests still hold.
export const TEST_CONDUIT: Address = '0x10d0e872ac36ab67beca3321b580345fed0b67bd'

export const LOCKED_SHARE_HOLDER: Address = '0x000000000000000000000000000000000000dEaD'
