import { type Address, type Client, type Hex, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { multiVehicleFactoryAbi } from '../../abi/multiVehicleFactory.js'
import type { Interception } from '../../types.js'

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
  salts: MultiVehicleSalts
  initialInterceptions?: Array<Interception>
}

/**
 * Spawns a multi-vehicle and its engines via `multiVehicleFactory.spawn()`. Needs FACTORY_SPAWN;
 * the factory pulls the asset's initial deposit from the caller.
 *
 * @param parameters - {@link SpawnMultiVehicleParameters}
 */
export function buildSpawnMultiVehicleCall(parameters: SpawnMultiVehicleParameters) {
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
        salts: parameters.salts,
        forbiddenAddresses: parameters.forbiddenAddresses ?? [],
        queryRegistry: parameters.queryRegistry,
      },
    ],
  } as const
}

/**
 * The address {@link buildSpawnMultiVehicleCall} will deploy to for these parameters: the
 * multi-vehicle and its five engines, CREATE2s over their salts.
 *
 * @param parameters - {@link SpawnMultiVehicleParameters}
 */
export async function predictMultiVehicleDeployment(
  client: Client,
  parameters: SpawnMultiVehicleParameters,
) {
  const { address, abi, args } = buildSpawnMultiVehicleCall(parameters)
  return readContract(client, { address, abi, functionName: 'getDeploymentAddresses', args })
}
