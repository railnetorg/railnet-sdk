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
  vehicleManager: Hex
  initialDepositQuery: Hex
}

export type SpawnMultiVehicleParameters = {
  factory: Address
  asset: Address
  name: string
  symbol: string
  accessControl: Address
  queryRegistry: Address
  feeManager?: Address
  modulesManager?: Address
  forbiddenAddresses?: Address[]
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

export function prepareSpawnMultiVehicle(parameters: SpawnMultiVehicleParameters) {
  const now = Date.now()
  const salts: MultiVehicleSalts = parameters.salts ?? {
    multiVehicle: keccak256(toHex(`multi-vehicle-${parameters.name}-${now}`)),
    queryRedeemQueue: keccak256(toHex(`query-redeem-queue-${parameters.name}-${now}`)),
    queueStrategyEngine: keccak256(toHex(`queue-strategy-engine-${parameters.name}-${now}`)),
    sectorAccountingEngine: keccak256(toHex(`sector-accounting-engine-${parameters.name}-${now}`)),
    subQueryEngine: keccak256(toHex(`sub-query-engine-${parameters.name}-${now}`)),
    vehicleManager: keccak256(toHex(`vehicle-manager-${parameters.name}-${now}`)),
    initialDepositQuery: keccak256(toHex(`initial-deposit-query-${parameters.name}-${now}`)),
  }

  return {
    address: parameters.factory,
    abi: multiVehicleFactoryAbi,
    functionName: 'spawn',
    args: [
      {
        asset: parameters.asset,
        name: parameters.name,
        symbol: parameters.symbol,
        initialInterceptions: parameters.initialInterceptions ?? [],
        accessControl: parameters.accessControl,
        feeManager: parameters.feeManager ?? zeroAddress,
        modulesManager: parameters.modulesManager ?? zeroAddress,
        salts,
        forbiddenAddresses: parameters.forbiddenAddresses ?? [],
        queryRegistry: parameters.queryRegistry,
      },
    ],
  } as const
}

/**
 * Spawns a new MultiVehicle ecosystem via the MultiVehicleFactory.
 * The factory pulls an initial deposit from the caller, so approve the factory for at least {@link getInitialDepositAmount} of `asset` first — this action sends no approval.
 * Use {@link extractMultiVehicleContracts} to extract the deployed contract addresses from the transaction receipt.
 *
 * @param parameters - {@link SpawnMultiVehicleParameters}
 *
 * @example
 * import { extractMultiVehicleContracts, getAddresses, spawnMultiVehicle } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { multiVehicleFactory, queryRegistry, usdc } = getAddresses(base.id)
 *
 * const hash = await spawnMultiVehicle(walletClient, {
 *   factory: multiVehicleFactory,
 *   asset: usdc,
 *   name: 'My Strategy',
 *   symbol: 'MSTRAT',
 *   accessControl: eacAddress,
 *   queryRegistry,
 *   account: account.address,
 * })
 * const receipt = await publicClient.waitForTransactionReceipt({ hash })
 * const contracts = extractMultiVehicleContracts(receipt, multiVehicleFactory)
 */
export async function spawnMultiVehicle(
  client: Client,
  parameters: SpawnMultiVehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareSpawnMultiVehicle(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
