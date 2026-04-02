import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { vehicleRegistryAbi } from '../../abi/vehicleRegistry.js'
import type { ContractCallOptions } from '../../types.js'

export type AuthorizeVehicleParameters = {
  vehicleRegistry: Address
  vehicle: Address
}

export async function authorizeVehicle(
  client: Client,
  parameters: AuthorizeVehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.vehicleRegistry,
    abi: vehicleRegistryAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
    account: parameters.account,
  })

  return writeContract(client, request)
}
