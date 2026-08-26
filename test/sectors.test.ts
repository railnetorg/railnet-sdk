import { describe, expect, it } from 'bun:test'
import { zeroAddress } from 'viem'
import {
  isVehicleSector,
  SECTOR_ALLOCATION,
  SECTOR_AVAILABLE,
  SECTOR_ENTRY,
  SECTOR_EXIT,
  SECTOR_RESERVED,
  sectorToVehicle,
  vehicleSector,
} from '../src/constants/sectors.js'

const VEHICLE = '0x2ec94b8979868Bf5586f8550733092A77Cd77c9E' as const

describe('static sectors', () => {
  // values transcribed from SectorLib in contracts: src/vehicles/multi/libs/Sector.sol
  it('match the on-chain constants', () => {
    expect(SECTOR_ENTRY).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
    expect(SECTOR_AVAILABLE).toBe(
      '0x0000000000000000000000000000000000000000000000617661696c61626c65',
    )
    expect(SECTOR_ALLOCATION).toBe(
      '0x00000000000000000000000000000000000000000000616c6c6f636174696f6e',
    )
    expect(SECTOR_RESERVED).toBe(
      '0x0000000000000000000000000000000000000000000000007265736572766564',
    )
    expect(SECTOR_EXIT).toBe('0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  })
})

describe('vehicleSector', () => {
  it('prefixes the vehicle address with 0x01 and eleven zero bytes', () => {
    expect(vehicleSector(VEHICLE)).toBe(
      '0x0100000000000000000000002ec94b8979868bf5586f8550733092a77cd77c9e',
    )
    expect(vehicleSector(VEHICLE)).toHaveLength(66)
  })

  it('round-trips through sectorToVehicle', () => {
    expect(sectorToVehicle(vehicleSector(VEHICLE))).toBe(
      '0x2ec94b8979868bf5586f8550733092a77cd77c9e',
    )
    expect(sectorToVehicle(vehicleSector(zeroAddress))).toBe(zeroAddress)
  })

  it('is distinguishable from static sectors', () => {
    expect(isVehicleSector(vehicleSector(VEHICLE))).toBe(true)
    for (const sector of [
      SECTOR_ENTRY,
      SECTOR_AVAILABLE,
      SECTOR_ALLOCATION,
      SECTOR_RESERVED,
      SECTOR_EXIT,
    ]) {
      expect(isVehicleSector(sector)).toBe(false)
      expect(sectorToVehicle(sector)).toBeUndefined()
    }
  })
})
