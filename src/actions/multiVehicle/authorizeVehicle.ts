import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { vehicleRegistryAbi } from '../../abi/vehicleRegistry.js'

export type AuthorizeVehicleParameters = {
  vehicleRegistry: Address
  vehicle: Address
}

export async function authorizeVehicle(
  walletClient: WalletClient<Transport, Chain>,
  parameters: AuthorizeVehicleParameters & { account: Address },
): Promise<Hash> {
  return walletClient.writeContract({
    address: parameters.vehicleRegistry,
    abi: vehicleRegistryAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
    account: parameters.account,
    chain: walletClient.chain,
  })
}
