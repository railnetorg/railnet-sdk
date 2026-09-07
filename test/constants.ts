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

// Beacon the v1.0.0 manifest pins the conduit implementation to. The shipped factory must report
// this one, or the addresses and the ABIs sit on different deployment generations.
export const CONDUIT_BEACON: Address = '0x94B7aBE28952bC3Ed7A9D64BFC1BaDb1513a671d'

// Conduit instance on the scalar-`Asset` generation, spawned before the v1.0.0 redeploy: the
// v1.0.0 factory has a zero `previousFactory` and disowns it, and no v1.0.0 conduit exists yet.
// Reads still hold — it runs the same scalar `estimate`/`convert` the shipped ABIs speak.
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
