import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { accountListFactoryAbi } from '../../abi/accountListFactory.js'
import type { AllowlistMode } from './types.js'

export type SpawnAccountListParameters = {
  factory: Address
  accessControl: Address
  mode: AllowlistMode
  initialAllowList: readonly Address[]
  initialBlockList: readonly Address[]
  /** Requires a non-zero `oracle`; the contract reverts `SanctionsOracleRequired` otherwise. */
  sanctionsEnabled: boolean
  /** An ISanctionsList contract, or the zero address while screening stays off. */
  oracle: Address
  deploymentSalt: Hex
}

function toSpawnParams(parameters: SpawnAccountListParameters) {
  return {
    accessControl: parameters.accessControl,
    mode: parameters.mode,
    initialAllowList: parameters.initialAllowList,
    initialBlockList: parameters.initialBlockList,
    sanctionsEnabled: parameters.sanctionsEnabled,
    oracle: parameters.oracle,
    deploymentSalt: parameters.deploymentSalt,
  } as const
}

/**
 * Spawns an AccountList, the compliance module a conduit screens its users against. The caller
 * needs FACTORY_SPAWN on the factory's access control.
 *
 * @param parameters - {@link SpawnAccountListParameters}
 */
export function buildSpawnAccountListCall(parameters: SpawnAccountListParameters) {
  return {
    address: parameters.factory,
    abi: accountListFactoryAbi,
    functionName: 'spawn',
    args: [toSpawnParams(parameters)],
  } as const
}

/**
 * The address {@link buildSpawnAccountListCall} will deploy to for these parameters.
 *
 * @param parameters - {@link SpawnAccountListParameters}
 */
export async function predictAccountListDeployment(
  client: Client,
  parameters: SpawnAccountListParameters,
): Promise<Address> {
  return readContract(client, {
    address: parameters.factory,
    abi: accountListFactoryAbi,
    functionName: 'getDeploymentAddress',
    args: [toSpawnParams(parameters)],
  })
}
