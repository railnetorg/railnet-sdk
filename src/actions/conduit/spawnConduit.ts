import {
  type Address,
  type Chain,
  type Hash,
  keccak256,
  type Transport,
  toHex,
  type WalletClient,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import { extractConduitDeployedAddress } from '../../utils/receipt.js'
import type { SpawnConduitParameters } from './types.js'

export type SpawnConduitReturnType = {
  conduitAddress: Address
  transactionHash: Hash
}

export async function spawnConduit(
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnConduitParameters & { account: Address },
): Promise<SpawnConduitReturnType> {
  const now = Date.now()
  const querySalt =
    parameters.querySalt ?? keccak256(toHex(`conduit-query-${parameters.name}-${now}`))
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`conduit-deploy-${parameters.symbol}-${now}`))
  const salt = keccak256(toHex(`conduit-salt-${parameters.name}-${now}`))

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

  const hash = await walletClient.writeContract({
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'spawn',
    args: [spawnParams, salt],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('Conduit spawn transaction reverted')
  }

  const conduitAddress = extractConduitDeployedAddress(receipt, parameters.factory)

  if (!conduitAddress) {
    throw new Error('Could not extract conduit address from transaction logs')
  }

  return {
    conduitAddress,
    transactionHash: hash,
  }
}
