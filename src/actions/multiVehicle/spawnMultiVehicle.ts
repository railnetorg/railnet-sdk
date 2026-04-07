import { type Address, type Client, type Hash, type Hex, keccak256, toHex, zeroAddress } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { multiVehicleFactoryAbi } from '../../abi/multiVehicleFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type MultiVehicleSalts = {
  multiVehicle: Hex
  queryRedeemQueue: Hex
  queueStrategyEngine: Hex
  sectorAccountingEngine: Hex
  subQueryEngine: Hex
  vehicleRegistry: Hex
  initialDepositQuery: Hex
}

export type SpawnMultiVehicleParameters = {
  factory: Address
  asset: Address
  name: string
  symbol: string
  accessControl: Address
  feeManager?: Address
  modulesManager?: Address
  initialDepositSize: bigint
  initialExpectedSupply: bigint
  salts?: MultiVehicleSalts
  initialInterceptions?: Array<{
    asset: Address
    recipients: Array<{
      target: Address
      shareBps: bigint
      chainId: bigint
    }>
  }>
}

/**
 * Spawns a new MultiVehicle ecosystem via the MultiVehicleFactory.
 * Use {@link extractMultiVehicleContracts} from `@railnetorg/railnet-sdk` to extract the
 * deployed contract addresses from the transaction receipt.
 */
export async function spawnMultiVehicle(
  client: Client,
  parameters: SpawnMultiVehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const now = Date.now()
  const salts: MultiVehicleSalts = parameters.salts ?? {
    multiVehicle: keccak256(toHex(`multi-vehicle-${parameters.name}-${now}`)),
    queryRedeemQueue: keccak256(toHex(`query-redeem-queue-${parameters.name}-${now}`)),
    queueStrategyEngine: keccak256(toHex(`queue-strategy-engine-${parameters.name}-${now}`)),
    sectorAccountingEngine: keccak256(toHex(`sector-accounting-engine-${parameters.name}-${now}`)),
    subQueryEngine: keccak256(toHex(`sub-query-engine-${parameters.name}-${now}`)),
    vehicleRegistry: keccak256(toHex(`vehicle-registry-${parameters.name}-${now}`)),
    initialDepositQuery: keccak256(toHex(`initial-deposit-query-${parameters.name}-${now}`)),
  }

  const initialInterceptions = parameters.initialInterceptions ?? []

  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.factory,
    abi: multiVehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        name: parameters.name,
        symbol: parameters.symbol,
        initialInterceptions,
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        salts,
        initialDepositSize: parameters.initialDepositSize,
        initialExpectedSupply: parameters.initialExpectedSupply,
      },
    ],
    account: parameters.account,
  })

  return writeContract(client, request)
}
