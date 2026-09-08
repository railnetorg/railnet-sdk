import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type UnauthorizeVehicleParameters = {
  vehicleManager: Address
  vehicle: Address
}

/**
 * Drops a sub-vehicle's authorization and its configuration.
 *
 * Does not unwind holdings: a vehicle can be unauthorized while the multi vehicle still holds a
 * position in it, which then stays put until an operator moves it.
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
