import {
  type Address,
  type Chain,
  type Hash,
  keccak256,
  type PublicClient,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { SpawnConduitParameters } from './types.js'

/**
 * Spawns a new Conduit via the ConduitFactory.
 * Use {@link extractConduitAddress} from `railnet-sdk` to extract the
 * deployed conduit address from the transaction receipt.
 */
export async function spawnConduit(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnConduitParameters & { account: Address },
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

  const simulateArgs = {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn' as const,
    args: [spawnParams, deploymentSalt] as const,
    account: parameters.account,
  }

  let lastError: unknown
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const { request } = await publicClient.simulateContract(simulateArgs)
      return walletClient.writeContract(request)
    } catch (error) {
      lastError = error
      if (attempt < 4) {
        await new Promise((resolve) => setTimeout(resolve, 1_000 * 2 ** attempt))
      }
    }
  }

  throw lastError
}
