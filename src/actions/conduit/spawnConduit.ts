import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { ContractCallOptions } from '../../types.js'
import type { SpawnConduitParameters } from './types.js'

export function prepareSpawnConduit(parameters: SpawnConduitParameters) {
  const spawnParams = {
    name: parameters.name,
    symbol: parameters.symbol,
    vehicle: parameters.vehicle,
    feeManager: parameters.feeManager,
    accountList: parameters.accountList,
    ownerRegistry: parameters.ownerRegistry,
    accessControl: parameters.accessControl,
    transferEnabled: parameters.transferEnabled,
    initialInterceptions: parameters.initialInterceptions ?? [],
    initialExpectedSupply: parameters.initialExpectedSupply,
    querySalt: parameters.querySalt,
    deploymentSalt: parameters.deploymentSalt,
  } as const

  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [spawnParams],
  } as const
}

/**
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams)`. `querySalt` and `deploymentSalt` are required fields of the spawn params; `deploymentSalt` fixes the conduit's address. Use {@link randomSalt} to generate them.
 * The factory pulls an initial deposit from the caller, so approve the factory for at least {@link getInitialDepositAmount} of the vehicle's asset first — this action sends no approval.
 * Use {@link extractConduitAddress} to extract the deployed conduit address from the transaction receipt.
 *
 * @param parameters - {@link SpawnConduitParameters}
 *
 * @example
 * import { extractConduitAddress, getAddresses, spawnConduit } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { conduitFactory } = getAddresses(base.id)
 *
 * const hash = await spawnConduit(walletClient, {
 *   factory: conduitFactory,
 *   name: 'My Conduit',
 *   symbol: 'MYC',
 *   vehicle: vehicleAddress,
 *   initialExpectedSupply: 10n ** 18n,
 *   transferEnabled: true,
 *   accessControl: eacAddress,
 *   feeManager: feeManagerAddress,
 *   accountList: accountListAddress,
 *   ownerRegistry: ownerRegistryAddress,
 *   account: account.address,
 * })
 * const receipt = await publicClient.waitForTransactionReceipt({ hash })
 * const conduit = extractConduitAddress(receipt, conduitFactory)
 */
export async function spawnConduit(
  client: Client,
  parameters: SpawnConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSpawnConduit(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
