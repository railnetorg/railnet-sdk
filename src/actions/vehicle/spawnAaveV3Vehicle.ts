import { type Address, type Client, type Hash, type Hex, keccak256, toHex, zeroAddress } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { aaveV3VehicleFactoryAbi } from '../../abi/aaveV3VehicleFactory.js'
import type { ContractCallOptions } from '../../types.js'

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

/**
 * Spawns a new Aave V3 Vehicle via the AaveV3VehicleFactory.
 * Use {@link extractAaveV3VehicleAddress} from `@railnetorg/railnet-sdk` to extract the
 * deployed vehicle address from the transaction receipt.
 */
export async function spawnAaveV3Vehicle(
  client: Client,
  parameters: SpawnAaveV3VehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const now = Date.now()
  const querySalt = parameters.querySalt ?? keccak256(toHex(`aave-v3-vehicle-query-${now}`))
  const deploymentSalt =
    parameters.deploymentSalt ?? keccak256(toHex(`aave-v3-vehicle-deploy-${now}`))

  const { request } = await simulateContract(client, {
    ...options,
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
  })

  return writeContract(client, request)
}
