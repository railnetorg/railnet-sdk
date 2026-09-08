import type { Address, Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { feeManagerFactoryAbi } from '../../abi/feeManagerFactory.js'
import type { FeeRecipient, Fees } from './types.js'

export type SpawnFeeManagerParameters = {
  factory: Address
  accessControl: Address
  initialFees: Fees
  /** Immutable ceilings on what {@link buildSetFeesCall} can ever set. */
  initialMaxFees: Fees
  /** Non-empty. */
  initialRecipients: readonly FeeRecipient[]
  /** Fixes the deployment address. Use {@link randomSalt}. */
  deploymentSalt: Hex
}

function toSpawnParams(parameters: SpawnFeeManagerParameters) {
  return {
    accessControl: parameters.accessControl,
    initialFees: parameters.initialFees,
    initialMaxFees: parameters.initialMaxFees,
    initialRecipients: parameters.initialRecipients,
    deploymentSalt: parameters.deploymentSalt,
  } as const
}

/**
 * Spawns a FeeManager via `feeManagerFactory.spawn(SpawnParams)`. The caller needs FACTORY_SPAWN on
 * the factory's access control. Unlike a conduit, nothing is pulled from the caller.
 *
 * @param parameters - {@link SpawnFeeManagerParameters}
 *
 * @example
 * import { buildSpawnFeeManagerCall, getAddresses, randomSalt } from '@railnetorg/railnet-sdk'
 * import { mainnet } from 'viem/chains'
 *
 * const { feeManagerFactory } = getAddresses(mainnet.id)
 *
 * const call = buildSpawnFeeManagerCall({
 *   factory: feeManagerFactory,
 *   accessControl,
 *   initialFees: { performanceFeeBps: 1000, managementFeeBps: 50, depositFeeBps: 0, redeemFeeBps: 0 },
 *   initialMaxFees: { performanceFeeBps: 2000, managementFeeBps: 200, depositFeeBps: 100, redeemFeeBps: 100 },
 *   initialRecipients: [{ target: treasury, shareBps: 10000 }],
 *   deploymentSalt: randomSalt(),
 * })
 */
export function buildSpawnFeeManagerCall(parameters: SpawnFeeManagerParameters) {
  return {
    address: parameters.factory,
    abi: feeManagerFactoryAbi,
    functionName: 'spawn',
    args: [toSpawnParams(parameters)],
  } as const
}

/**
 * The address {@link buildSpawnFeeManagerCall} will deploy to for these parameters. Only
 * `deploymentSalt` moves it, so the same salt and factory always resolve to the same address.
 *
 * @param parameters - {@link SpawnFeeManagerParameters}
 */
export async function predictFeeManagerDeployment(
  client: Client,
  parameters: SpawnFeeManagerParameters,
): Promise<Address> {
  return readContract(client, {
    address: parameters.factory,
    abi: feeManagerFactoryAbi,
    functionName: 'getDeploymentAddress',
    args: [toSpawnParams(parameters)],
  })
}
