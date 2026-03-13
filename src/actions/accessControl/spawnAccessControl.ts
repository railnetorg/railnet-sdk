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
import { extractAccessControlAddress } from '../../utils/receipt.js'

export type SpawnAccessControlParameters = {
  factory: Address
  initialDefaultAdmin: Address
  initialDelay?: number
  initialRoles?: Array<{ account: Address; role: Hex }>
  deploymentSalt?: Hex
}

export type SpawnAccessControlReturnType = {
  accessControlAddress: Address
  transactionHash: Hash
}

export async function spawnAccessControl(
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnAccessControlParameters & { account: Address },
): Promise<SpawnAccessControlReturnType> {
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

  const hash = await walletClient.writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  const accessControlAddress = extractAccessControlAddress(receipt, parameters.factory)

  if (!accessControlAddress) {
    throw new Error('Could not extract access control address from transaction logs')
  }

  return {
    accessControlAddress,
    transactionHash: hash,
  }
}
