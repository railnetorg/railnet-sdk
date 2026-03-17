import {
  type Address,
  type Chain,
  type Hash,
  type Hex,
  keccak256,
  type PublicClient,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { accessControlFactoryAbi } from '../../abi/accessControlFactory.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt?: Hex
}

/**
 * Spawns a new ExternalAccessControl via the AccessControlFactory.
 * Use {@link extractAccessControlAddress} from `railnet-sdk` to extract the
 * deployed address from the transaction receipt.
 */
export async function spawnAccessControl(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnAccessControlParameters & { account: Address },
): Promise<Hash> {
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`access-control-${Date.now()}`))
  const initialDelay = parameters.initialDelay ?? 0
  const initialRoles = parameters.initialRoles ?? []

  const { request } = await publicClient.simulateContract({
    address: parameters.factory,
    abi: accessControlFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        initialDelay,
        initialDefaultAdmin: parameters.initialDefaultAdmin,
        initialRoles,
        deploymentSalt,
      },
    ],
    account: parameters.account,
  })

  return walletClient.writeContract(request)
}
