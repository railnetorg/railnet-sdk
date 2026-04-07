import type { Address } from 'viem'
import { addresses } from '../src/contracts/addresses.js'

export const BASE_CHAIN_ID = 8453
export const BASE_ADDRESSES = addresses[BASE_CHAIN_ID]

export const USDC: Address = BASE_ADDRESSES.usdc
export const CONDUIT_FACTORY: Address = BASE_ADDRESSES.conduitFactory
export const MULTI_VEHICLE_FACTORY: Address = BASE_ADDRESSES.multiVehicleFactory
export const EAC_FACTORY: Address = BASE_ADDRESSES.eacFactory
export const AAVE_V3_VEHICLE_FACTORY: Address = BASE_ADDRESSES.aaveV3VehicleFactory
export const AAVE_V3_VEHICLE: Address = BASE_ADDRESSES.aaveV3Vehicle

export const TEST_CONDUIT: Address = '0x18c5697c60b83a65cef96f8df2e8507f3e25b251'
