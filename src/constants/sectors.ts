import { type Address, concat, type Hex, pad, toHex, zeroHash } from 'viem'

export type Sector = Hex

const VEHICLE_SECTOR_PREFIX = '0x010000000000000000000000' as const

export const SECTOR_ENTRY: Sector = zeroHash
export const SECTOR_AVAILABLE: Sector = pad(toHex('available'), { size: 32 })
export const SECTOR_ALLOCATION: Sector = pad(toHex('allocation'), { size: 32 })
export const SECTOR_RESERVED: Sector = pad(toHex('reserved'), { size: 32 })
export const SECTOR_EXIT: Sector =
  '0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/**
 * Builds the sector holding a vehicle's position.
 *
 * @example
 * import { vehicleSector } from '@railnetorg/railnet-sdk'
 *
 * vehicleSector('0x2Ec94b8979868bF5586f8550733092a77Cd77C9E')
 * // 0x0100000000000000000000002ec94b8979868bf5586f8550733092a77cd77c9e
 */
export function vehicleSector(vehicle: Address): Sector {
  return concat([VEHICLE_SECTOR_PREFIX, vehicle.toLowerCase() as Hex])
}

/**
 * Returns whether a sector identifies a vehicle rather than a static or query sector.
 */
export function isVehicleSector(sector: Sector): boolean {
  return sector.toLowerCase().startsWith(VEHICLE_SECTOR_PREFIX)
}

/**
 * @returns The vehicle address, or `undefined` for a static or query sector.
 */
export function sectorToVehicle(sector: Sector): Address | undefined {
  if (!isVehicleSector(sector)) return undefined
  return `0x${sector.slice(-40)}` as Address
}
