import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import { toConduitSpawnParams } from './spawnConduit.js'
import type { SpawnConduitParameters } from './types.js'

export type PredictConduitDeploymentParameters = SpawnConduitParameters

export type PredictConduitDeploymentReturnType = Address

/**
 * Reads the address `buildSpawnConduitCall` will deploy to for the same parameters, a CREATE2 over
 * the proxy's init code.
 *
 * @param parameters - {@link PredictConduitDeploymentParameters}
 *
 * @example
 * import { getAddresses, predictConduitDeployment } from '@railnetorg/railnet-sdk'
 * import { mainnet } from 'viem/chains'
 *
 * const { conduitFactory } = getAddresses(mainnet.id)
 *
 * const predicted = await predictConduitDeployment(publicClient, {
 * factory: conduitFactory,
 * name: 'My Conduit',
 * symbol: 'MYC',
 * vehicle: vehicleAddress,
 * initialExpectedSupply: 10n ** 18n,
 * transferEnabled: true,
 * accessControl: eacAddress,
 * feeManager: feeManagerAddress,
 * accountList: accountListAddress,
 * ownerRegistry: ownerRegistryAddress,
 * querySalt,
 * deploymentSalt,
 * })
 */
export async function predictConduitDeployment(
  client: Client,
  parameters: PredictConduitDeploymentParameters,
): Promise<PredictConduitDeploymentReturnType> {
  return readContract(client, {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'predictConduitDeployment',
    args: [toConduitSpawnParams(parameters)],
  })
}
