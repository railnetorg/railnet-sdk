import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { SpawnConduitParameters } from './types.js'

export type PredictConduitDeploymentParameters = Required<
  Pick<SpawnConduitParameters, 'querySalt' | 'deploymentSalt'>
> &
  Omit<SpawnConduitParameters, 'querySalt' | 'deploymentSalt'>

export type PredictConduitDeploymentReturnType = Address

/**
 * Predicts the address a conduit will be deployed to, given the spawn parameters. Uses CREATE2 deterministic deployment.
 * @param client - Viem client instance
 * @param parameters - Full spawn parameters with required querySalt and deploymentSalt
 * @returns The predicted conduit address
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
