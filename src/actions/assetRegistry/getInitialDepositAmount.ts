import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { assetRegistryAbi } from '../../abi/assetRegistry.js'

export type GetInitialDepositAmountParameters = {
  assetRegistry: Address
  asset: Address
}

export type GetInitialDepositAmountReturnType = bigint

/**
 * Reads the initial deposit amount the factories pull from the caller when spawning a conduit or a vehicle for this asset.
 * Approve at least this amount to the factory before calling `spawnConduit`, `spawnMultiVehicle`, or `spawnAaveV3Vehicle`.
 * @param client - Viem client instance
 * @param parameters - AssetRegistry address and the asset to look up
 * @returns The initial deposit amount, in the asset's own decimals
 */
export async function getInitialDepositAmount(
  client: Client,
  parameters: GetInitialDepositAmountParameters,
): Promise<GetInitialDepositAmountReturnType> {
  return readContract(client, {
    address: parameters.assetRegistry,
    abi: assetRegistryAbi,
    functionName: 'getInitialDepositAmount',
    args: [parameters.asset],
  })
}
