import type { Address, Chain, Hash, Transport, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { vehicleRegistryAbi } from '../../abi/vehicleRegistry.js'

export type AuthorizeVehicleParameters = {
  vehicleRegistry: Address
  vehicle: Address
}

export type AuthorizeVehicleReturnType = {
  transactionHash: Hash
}

export async function authorizeVehicle(
  walletClient: WalletClient<Transport, Chain>,
  parameters: AuthorizeVehicleParameters & { account: Address },
): Promise<AuthorizeVehicleReturnType> {
  const hash = await walletClient.writeContract({
    address: parameters.vehicleRegistry,
    abi: vehicleRegistryAbi,
    functionName: 'authorize',
    args: [parameters.vehicle],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Authorize vehicle transaction reverted')
  }

  return {
    transactionHash: hash,
  }
}
