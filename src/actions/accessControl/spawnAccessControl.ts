import { type Address, type Client, type Hash, type Hex, keccak256, toHex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
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
  client: Client,
  parameters: SpawnAccessControlParameters & { account: Address },
): Promise<Hash> {
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`access-control-${Date.now()}`))
  const initialDelay = parameters.initialDelay ?? 0
  const initialRoles = parameters.initialRoles ?? []

  const { request } = await simulateContract(client, {
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

  return writeContract(client, request)
}
