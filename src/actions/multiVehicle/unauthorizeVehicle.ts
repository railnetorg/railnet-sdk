import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type UnauthorizeVehicleParameters = {
  vehicleManager: Address
  vehicle: Address
}

/**
 * Drops a sub-vehicle's authorization and its configuration. Holdings stay where they are until an
 * operator moves them.
 *
 * @param parameters - {@link UnauthorizeVehicleParameters}
 */
export function buildUnauthorizeVehicleCall(parameters: UnauthorizeVehicleParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'unauthorize',
    args: [parameters.vehicle],
  } as const
}
