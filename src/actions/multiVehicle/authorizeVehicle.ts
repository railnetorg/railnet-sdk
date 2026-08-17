import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'
import type { ContractCallOptions } from '../../types.js'

export type AuthorizeVehicleParameters = {
  vehicleManager: Address
  vehicle: Address
}

export function prepareAuthorizeVehicle(parameters: AuthorizeVehicleParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
  } as const
}

/**
 * Authorizes a vehicle in a multi-vehicle's VehicleManager, allowing it to receive allocations.
 * @param client - Viem client instance
 * @param parameters - VehicleManager address and the vehicle address to authorize
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function authorizeVehicle(
  client: Client,
  parameters: AuthorizeVehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareAuthorizeVehicle(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
