import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type AuthorizeVehicleParameters = {
  vehicleManager: Address
  vehicle: Address
}

/**
 * Authorizes a vehicle in a multi-vehicle's VehicleManager, allowing it to receive allocations.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link AuthorizeVehicleParameters}
 */
export function prepareAuthorizeVehicle(parameters: AuthorizeVehicleParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
  } as const
}
