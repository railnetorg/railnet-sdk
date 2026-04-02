import { type Address, type Client, type Hash, keccak256, toHex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { ContractCallOptions } from '../../types.js'
import type { SpawnConduitParameters } from './types.js'

/**
 * Spawns a new Conduit via the ConduitFactory.
 * Use {@link extractConduitAddress} from `railnet-sdk` to extract the
 * deployed conduit address from the transaction receipt.
 */
export async function spawnConduit(
  client: Client,
  parameters: SpawnConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
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
    transferMode: parameters.transferMode,
    initialDepositSize: parameters.initialDepositSize,
    initialExpectedSupply: parameters.initialExpectedSupply,
    depositAsset: parameters.depositAsset,
    querySalt,
    deploymentSalt,
  } as const

  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [spawnParams, deploymentSalt],
    account: parameters.account,
  })

  return writeContract(client, request)
}
