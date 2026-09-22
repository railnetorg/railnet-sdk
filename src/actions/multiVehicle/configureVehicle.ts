import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

/** Declaration order is the on-chain encoding. */
export const VehicleMode = {
  Automatic: 0,
  Manual: 1,
} as const

export type VehicleMode = (typeof VehicleMode)[keyof typeof VehicleMode]

export type VehicleCap = {
  /**
   * Cap in the sub-vehicle's share units (18 decimals), the units the SectorAccountingEngine holds
   * it in. `2n ** 256n - 1n` means unlimited; `threshold` is then ignored but stored as passed, so
   * send 0.
   */
  value: bigint
  /** Tolerance margin, same share units. Must not exceed `value` on a finite cap. */
  threshold: bigint
}

export type VehicleConfig = {
  mode: VehicleMode
  cap: VehicleCap
}

export type ConfigureVehicleParameters = {
  vehicleManager: Address
  vehicle: Address
  config: VehicleConfig
}

/**
 * Sets an authorized sub-vehicle's allocation mode and cap, replacing the whole configuration.
 * `Manual` keeps the queue strategy from allocating into it. Needs
 * MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION; reverts `VehicleNotAuthorized`, `InvalidTarget` on
 * `threshold > value`, and `StateUnchanged` when nothing changes.
 *
 * @param parameters - {@link ConfigureVehicleParameters}
 */
export function buildConfigureVehicleCall(parameters: ConfigureVehicleParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'configure',
    args: [parameters.vehicle, parameters.config],
  } as const
}
