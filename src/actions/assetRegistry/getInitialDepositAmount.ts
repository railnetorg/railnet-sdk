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
 * @returns The initial deposit amount, in the asset's own decimals
 *
 * @param parameters - {@link GetInitialDepositAmountParameters}
 *
 * @example
 * import { getAddresses, getInitialDepositAmount } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { assetRegistry, usdc } = getAddresses(base.id)
 *
 * const amount = await getInitialDepositAmount(publicClient, { assetRegistry, asset: usdc })
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
