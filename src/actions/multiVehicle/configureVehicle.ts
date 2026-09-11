import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

/** `VehicleManagerStore.VehicleMode`: declaration order is the on-chain encoding. */
export const VehicleMode = {
  Automatic: 0,
  Manual: 1,
} as const

export type VehicleMode = (typeof VehicleMode)[keyof typeof VehicleMode]

export type VehicleCap = {
  /**
   * Cap in the SUB-VEHICLE's share units (18 decimals) — not the multi vehicle's asset:
   * SectorAccountingEngine compares it against that vehicle's share holdings. `2n ** 256n - 1n`
   * means unlimited; `threshold` is then ignored but stored as passed, so send 0 to keep the
   * stored config comparable.
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
 * Sets an authorized sub-vehicle's allocation mode and cap.
 *
 * Replaces the whole configuration: `VehicleManager.configure` assigns the struct outright, so a
 * caller that does not start from the current config silently resets whatever it did not set.
 * `Manual` keeps the queue strategy from allocating into the vehicle, leaving it to operator
 * dispatches.
 *
 * The caller needs MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION. Reverts `VehicleNotAuthorized` on a
 * vehicle that was never authorized, `InvalidTarget` when a finite cap carries
 * `threshold > value`, and `StateUnchanged` when mode and cap already hold.
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
