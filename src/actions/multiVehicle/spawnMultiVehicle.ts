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
import { multiVehicleFactoryAbi } from '../../abi/multiVehicleFactory.js'
import { extractMultiVehicleContracts, type MultiVehicleContracts } from '../../utils/receipt.js'

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

export type SpawnMultiVehicleReturnType = {
  contracts: MultiVehicleContracts
  transactionHash: Hash
}

export async function spawnMultiVehicle(
  walletClient: WalletClient<Transport, Chain>,
  parameters: SpawnMultiVehicleParameters & { account: Address },
): Promise<SpawnMultiVehicleReturnType> {
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

  const hash = await walletClient.writeContract({
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
    chain: walletClient.chain,
  })

  const receipt = await waitForTransactionReceipt(walletClient, { hash })
  const contracts = extractMultiVehicleContracts(receipt, parameters.factory)

  if (!contracts) {
    throw new Error('Could not extract multi-vehicle contracts from transaction logs')
  }

  return {
    contracts,
    transactionHash: hash,
  }
}
