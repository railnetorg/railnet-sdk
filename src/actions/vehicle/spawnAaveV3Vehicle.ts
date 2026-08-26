import { type Address, type Client, type Hash, type Hex, zeroAddress } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { aaveV3VehicleFactoryAbi } from '../../abi/aaveV3VehicleFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type SpawnAaveV3VehicleParameters = {
  factory: Address
  asset: Address
  poolAddressesProvider: Address
  accessControl: Address
  queryRegistry: Address
  feeManager?: Address
  modulesManager?: Address
  forbiddenAddresses?: Address[]
  initialExpectedSupply: bigint
  querySalt: Hex
  deploymentSalt: Hex
}

export function prepareSpawnAaveV3Vehicle(parameters: SpawnAaveV3VehicleParameters) {
  return {
    address: parameters.factory,
    abi: aaveV3VehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        poolAddressesProvider: parameters.poolAddressesProvider,
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        querySalt: parameters.querySalt,
        deploymentSalt: parameters.deploymentSalt,
        forbiddenAddresses: parameters.forbiddenAddresses ?? [],
        initialExpectedSupply: parameters.initialExpectedSupply,
        queryRegistry: parameters.queryRegistry,
      },
    ],
  } as const
}

/**
 * Spawns a new Aave V3 Vehicle via the AaveV3VehicleFactory.
 * The factory pulls an initial deposit from the caller, so approve the factory for at least {@link getInitialDepositAmount} of `asset` first — this action sends no approval.
 * Use {@link extractAaveV3VehicleAddress} to extract the deployed vehicle address from the transaction receipt.
 *
 * @param parameters - {@link SpawnAaveV3VehicleParameters}
 *
 * @example
 * import { extractAaveV3VehicleAddress, getAddresses, spawnAaveV3Vehicle } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { aaveV3VehicleFactory, aavePoolAddressesProvider, queryRegistry, usdc } = getAddresses(base.id)
 *
 * const hash = await spawnAaveV3Vehicle(walletClient, {
 *   factory: aaveV3VehicleFactory,
 *   asset: usdc,
 *   poolAddressesProvider: aavePoolAddressesProvider,
 *   accessControl: eacAddress,
 *   queryRegistry,
 *   initialExpectedSupply: 10n ** 18n,
 *   account: account.address,
 * })
 */
export async function spawnAaveV3Vehicle(
  client: Client,
  parameters: SpawnAaveV3VehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSpawnAaveV3Vehicle(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
