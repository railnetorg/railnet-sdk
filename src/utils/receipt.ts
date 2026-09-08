import type { Abi, Address, ContractEventName, Hex, TransactionReceipt } from 'viem'
import { parseEventLogs } from 'viem'
import { aaveV3VehicleFactoryAbi } from '../abi/aaveV3VehicleFactory.js'
import { accessControlFactoryAbi } from '../abi/accessControlFactory.js'
import { conduitAbi } from '../abi/conduit.js'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'
import { multiVehicleFactoryAbi } from '../abi/multiVehicleFactory.js'

/**
 * Decodes the events one contract emitted in a receipt. Filtering by emitter matters: a factory's
 * transaction carries the logs of everything it deployed, and several Railnet events share an
 * argument name.
 */
function eventsFrom<const abi extends Abi, eventName extends ContractEventName<abi>>(
  receipt: TransactionReceipt,
  emitter: Address,
  abi: abi,
  eventName: eventName,
) {
  return parseEventLogs({
    abi,
    eventName,
    logs: receipt.logs.filter((log) => log.address.toLowerCase() === emitter.toLowerCase()),
  })
}

/**
 * Extracts the deployed ExternalAccessControl address from a {@link buildSpawnAccessControlCall} transaction receipt.
 * @returns The deployed EAC address, or `null` if the event is not found
 */
export function extractAccessControlAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  const [event] = eventsFrom(
    receipt,
    factoryAddress,
    accessControlFactoryAbi,
    'SpawnedExternalAccessControl',
  )

  return event?.args.eac ?? null
}

/**
 * Extracts the deployed Aave V3 Vehicle address from a {@link buildSpawnAaveV3VehicleCall} transaction receipt.
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractAaveV3VehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  const [event] = eventsFrom(
    receipt,
    factoryAddress,
    aaveV3VehicleFactoryAbi,
    'SpawnedAaveV3Vehicle',
  )

  return event?.args.vehicle ?? null
}

export type MultiVehicleContracts = {
  multiVehicle: Address
  queryRedeemQueue: Address
  queueStrategyEngine: Address
  sectorAccountingEngine: Address
  subQueryEngine: Address
  vehicleManager: Address
}

/**
 * Extracts all deployed multi-vehicle contract addresses from a {@link buildSpawnMultiVehicleCall} transaction receipt.
 * @returns All deployed contract addresses (multiVehicle, queryRedeemQueue, queueStrategyEngine, etc.), or `null` if the event is not found
 */
export function extractMultiVehicleContracts(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): MultiVehicleContracts | null {
  const [event] = eventsFrom(receipt, factoryAddress, multiVehicleFactoryAbi, 'SpawnedMultiVehicle')
  if (!event) {
    return null
  }

  const { contracts } = event.args

  return {
    multiVehicle: contracts.multiVehicle,
    queryRedeemQueue: contracts.queryRedeemQueue,
    queueStrategyEngine: contracts.queueStrategyEngine,
    sectorAccountingEngine: contracts.sectorAccountingEngine,
    subQueryEngine: contracts.subQueryEngine,
    vehicleManager: contracts.vehicleManager,
  }
}

/**
 * Extracts the deployed conduit address from a {@link buildSpawnConduitCall} transaction receipt.
 * @returns The deployed conduit address, or `null` if the event is not found
 */
export function extractConduitAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  const [event] = eventsFrom(receipt, factoryAddress, conduitFactoryAbi, 'ConduitDeployed')

  return event?.args.conduit ?? null
}

export type CreatedQuery = {
  queryId: Hex
  receiver: Address
}

/**
 * Extracts the queries a transaction created on a conduit, in log order, from its `QueryCreated`
 * events. A deposit's id is known before it is sent — see {@link toQueryId} — but a redeem's query
 * is assembled on chain, so this is how to learn its id.
 * @returns One entry per created query, empty when the transaction created none
 */
export function extractQueryIds(
  receipt: TransactionReceipt,
  conduit: Address,
): Array<CreatedQuery> {
  return eventsFrom(receipt, conduit, conduitAbi, 'QueryCreated').map((event) => ({
    queryId: event.args.queryId,
    receiver: event.args.receiver,
  }))
}
