import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { SpawnConduitParameters } from './types.js'

export type PredictConduitDeploymentParameters = SpawnConduitParameters

export type PredictConduitDeploymentReturnType = Address

/**
 * Predicts the address a conduit will be deployed to, given the spawn parameters. Uses CREATE2 deterministic deployment.
 *
 * @param parameters - {@link PredictConduitDeploymentParameters}
 *
 * @example
 * import { getAddresses, predictConduitDeployment } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { conduitFactory } = getAddresses(base.id)
 *
 * const predicted = await predictConduitDeployment(publicClient, {
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
 *   querySalt,
 *   deploymentSalt,
 * })
 */
export async function predictConduitDeployment(
  client: Client,
  parameters: PredictConduitDeploymentParameters,
): Promise<PredictConduitDeploymentReturnType> {
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

  return readContract(client, {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'predictConduitDeployment',
    args: [spawnParams],
  })
}
