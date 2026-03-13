import type { Address, Chain, Hash, PublicClient, Transport, WalletClient } from 'viem'
import { vehicleRegistryAbi } from '../../abi/vehicleRegistry.js'

export type AuthorizeVehicleParameters = {
  vehicleRegistry: Address
  vehicle: Address
}

export async function authorizeVehicle(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: AuthorizeVehicleParameters & { account: Address },
): Promise<Hash> {
  const { request } = await publicClient.simulateContract({
    address: parameters.vehicleRegistry,
    abi: vehicleRegistryAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
