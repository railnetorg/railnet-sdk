import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { vehicleRegistryAbi } from '../../abi/vehicleRegistry.js'

export type AuthorizeVehicleParameters = {
  vehicleRegistry: Address
  vehicle: Address
}

export async function authorizeVehicle(
  publicClient: Client,
  walletClient: Client,
  parameters: AuthorizeVehicleParameters & { account: Address },
): Promise<Hash> {
  const { request } = await simulateContract(publicClient, {
    address: parameters.vehicleRegistry,
    abi: vehicleRegistryAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
    account: parameters.account,
  })

  return writeContract(walletClient, request)
}
