import type { Address } from 'viem'
import { baseVehicleAbi } from '../../abi/baseVehicle.js'
import { conduitAbi } from '../../abi/conduit.js'
import type { Interception } from '../../types.js'

const BPS_MAX = 10_000n

/**
 * Each interception's recipients may sum to at most 10000 bps, where a fee split must total exactly
 * that. A shortfall is legal and leaves the remainder undistributed.
 *
 * @throws Error if an interception's shares exceed 10000 bps
 */
export function assertInterceptions(interceptions: readonly Interception[]): void {
  for (const interception of interceptions) {
    let total = 0n

    for (const recipient of interception.recipients) {
      if (recipient.shareBps < 0n) {
        throw new Error(`interception for ${interception.asset} has a negative shareBps`)
      }
      total += recipient.shareBps
    }

    if (total > BPS_MAX) {
      throw new Error(
        `interception for ${interception.asset} totals ${total} bps: it must not exceed ${BPS_MAX}`,
      )
    }
  }
}

export type SetConduitInterceptionsParameters = {
  conduit: Address
  /** Replaces the stored list wholesale. An empty array clears every rule. */
  interceptions: readonly Interception[]
}

/**
 * Builds the `conduit.setInterceptions()` call, which replaces the stored interception rules.
 * Needs CONDUIT_SET_INTERCEPTIONS.
 *
 * @param parameters - {@link SetConduitInterceptionsParameters}
 * @throws Error if an interception's shares exceed 10000 bps
 */
export function buildSetConduitInterceptionsCall(parameters: SetConduitInterceptionsParameters) {
  assertInterceptions(parameters.interceptions)

  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'setInterceptions',
    args: [parameters.interceptions],
  } as const
}

export type SetVehicleInterceptionsParameters = {
  vehicle: Address
  /** Replaces the stored list wholesale. An empty array clears every rule. */
  interceptions: readonly Interception[]
}

/**
 * The vehicle-side counterpart of {@link buildSetConduitInterceptionsCall}. Needs
 * VEHICLE_SET_INTERCEPTIONS, scoped to the vehicle.
 *
 * @param parameters - {@link SetVehicleInterceptionsParameters}
 * @throws Error if an interception's shares exceed 10000 bps
 */
export function buildSetVehicleInterceptionsCall(parameters: SetVehicleInterceptionsParameters) {
  assertInterceptions(parameters.interceptions)

  return {
    address: parameters.vehicle,
    abi: baseVehicleAbi,
    functionName: 'setInterceptions',
    args: [parameters.interceptions],
  } as const
}
