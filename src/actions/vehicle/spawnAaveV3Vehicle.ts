import {
  type Address,
  type Chain,
  type Hash,
  type Hex,
  keccak256,
  type Transport,
  toHex,
  type WalletClient,
  zeroAddress,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { aaveV3VehicleFactoryAbi } from '../../abi/aaveV3VehicleFactory.js'
import { extractEventAddress } from '../../utils/receipt.js'

export type SpawnAaveV3VehicleParameters = {
  factory: Address
  asset: Address
  poolAddressesProvider: Address
  accessControl: Address
  feeManager?: Address
  modulesManager?: Address
  initialDepositSize: bigint
  initialExpectedSupply: bigint
  querySalt?: Hex
  deploymentSalt?: Hex
}

export type SpawnAaveV3VehicleReturnType = {
  vehicleAddress: Address
  transactionHash: Hash
}

export async function spawnAaveV3Vehicle(
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnAaveV3VehicleParameters & { account: Address },
): Promise<SpawnAaveV3VehicleReturnType> {
  const now = Date.now()
  const querySalt = parameters.querySalt ?? keccak256(toHex(`aave-v3-vehicle-query-${now}`))
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`aave-v3-vehicle-deploy-${now}`))

  const hash = await walletClient.writeContract({
    address: parameters.factory,
    abi: aaveV3VehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        poolAddressesProvider: parameters.poolAddressesProvider,
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        querySalt,
        deploymentSalt,
        initialDepositSize: parameters.initialDepositSize,
        initialExpectedSupply: parameters.initialExpectedSupply,
      },
    ],
    account: parameters.account,
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })

  if (receipt.status === 'reverted') {
    throw new Error('AaveV3 vehicle spawn transaction reverted')
  }

  const vehicleAddress = extractEventAddress(receipt, {
    abi: aaveV3VehicleFactoryAbi,
    eventName: 'SpawnedAaveV3Vehicle',
    fromAddress: parameters.factory,
    argName: 'vehicle',
  })

  if (!vehicleAddress) {
    throw new Error('Could not extract vehicle address from transaction logs')
  }

  return {
    vehicleAddress,
    transactionHash: hash,
  }
}
