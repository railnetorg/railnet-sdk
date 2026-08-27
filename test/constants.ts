import type { Address } from 'viem'
import { addresses } from '../src/contracts/addresses.js'

export const BASE_CHAIN_ID = 8453
export const BASE_ADDRESSES = addresses[BASE_CHAIN_ID]

export const USDC: Address = BASE_ADDRESSES.usdc
export const CONDUIT_FACTORY: Address = BASE_ADDRESSES.conduitFactory
export const MULTI_VEHICLE_FACTORY: Address = BASE_ADDRESSES.multiVehicleFactory
export const EAC_FACTORY: Address = BASE_ADDRESSES.eacFactory
export const AAVE_V3_VEHICLE_FACTORY: Address = BASE_ADDRESSES.aaveV3VehicleFactory
export const ASSET_REGISTRY: Address = BASE_ADDRESSES.assetRegistry

// Conduit instance on the scalar-`Asset` generation: beacon 0x83BAF6312D1fa077F41e8EEef4e7FB361be47f57
// spawned by ConduitFactory 0x36Fbc89D0d2bFCc333e0075bd73c6A4dFcBA121A at block 50396003.
//
// The previous fixture 0x43ea8bd0b15780ba5659086c60f72fafd1cfccd9 sits on a superseded beacon
// (0xc9629a6f…, impl 0x7d3b5578…) whose `estimate`/`convert` still take `Asset[]`. Calling it with
// the scalar ABI reverts, since the array and scalar forms have different selectors:
//   estimate((address,uint256),uint8,uint8)   -> 0xd34eca33  (this generation)
//   estimate((address,uint256)[],uint8,uint8) -> 0xc1bad5eb  (superseded)
export const TEST_CONDUIT: Address = '0x10d0e872ac36ab67beca3321b580345fed0b67bd'

// Seed shares are burned to this address when a conduit is finalized (Factory.sol:241),
// so its cShare balance is non-zero and permanently locked. Used to exercise the `convert` leg of
// getConduitPosition, which is skipped entirely when the account holds no shares.
export const LOCKED_SHARE_HOLDER: Address = '0x000000000000000000000000000000000000dEaD'
