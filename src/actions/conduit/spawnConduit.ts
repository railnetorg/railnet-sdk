import { type Address, type Client, type Hash, keccak256, toHex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { ContractCallOptions } from '../../types.js'
import type { SpawnConduitParameters } from './types.js'

export function prepareSpawnConduit(parameters: SpawnConduitParameters) {
  const now = Date.now()
  const querySalt =
    parameters.querySalt ?? keccak256(toHex(`conduit-query-${parameters.name}-${now}`))
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`conduit-deploy-${parameters.symbol}-${now}`))
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
    querySalt,
    deploymentSalt,
  } as const

  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [spawnParams, deploymentSalt],
  } as const
}

/**
 * Spawns a new Conduit via `conduitFactory.spawn(SpawnParams, salt)`. Generates deterministic salts (querySalt, deploymentSalt) if not provided.
 * The factory pulls an initial deposit from the caller, so approve the factory for at least {@link getInitialDepositAmount} of the vehicle's asset first — this action sends no approval.
 * Use {@link extractConduitAddress} to extract the deployed conduit address from the transaction receipt.
 * @param client - Viem client instance
 * @param parameters - Factory address, name, symbol, vehicle, initialExpectedSupply, transferEnabled, accessControl, feeManager, accountList, ownerRegistry. Optional: initialInterceptions, querySalt, deploymentSalt
 * @param options - Optional contract call overrides
 * @returns Transaction hash of the spawn
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
