import type { Abi, Address, ContractEventName, Hex, TransactionReceipt } from 'viem'
import { isAddressEqual, parseEventLogs } from 'viem'
import { aaveV3VehicleFactoryAbi } from '../abi/aaveV3VehicleFactory.js'
import { accessControlFactoryAbi } from '../abi/accessControlFactory.js'
import { accountListFactoryAbi } from '../abi/accountListFactory.js'
import { conduitAbi } from '../abi/conduit.js'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'
import { erc4626VehicleFactoryAbi } from '../abi/erc4626VehicleFactory.js'
import { feeManagerFactoryAbi } from '../abi/feeManagerFactory.js'
import { morphoBlueVehicleFactoryAbi } from '../abi/morphoBlueVehicleFactory.js'
import { multiVehicleFactoryAbi } from '../abi/multiVehicleFactory.js'
import { ownerRegistryFactoryAbi } from '../abi/ownerRegistryFactory.js'
import { queryRegistryAbi } from '../abi/queryRegistry.js'
import { wrapperVehicleFactoryAbi } from '../abi/wrapperVehicleFactory.js'
import { toQueryId } from '../actions/conduit/queryId.js'
import type { Query } from '../types.js'

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
 * A factory's spawn event in a receipt. A transaction can carry several callers' spawns (a bundle of
 * user operations, a wrapper around a multisig execution), so pass `deployer`, the account that
 * called the factory, to read that account's spawn and no one else's.
 */
function spawnEvent<const abi extends Abi, eventName extends ContractEventName<abi>>(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  abi: abi,
  eventName: eventName,
  deployer: Address | undefined,
) {
  const events = eventsFrom(receipt, factoryAddress, abi, eventName) as Array<
    ReturnType<typeof eventsFrom<abi, eventName>>[number] & { args: { deployer: Address } }
  >
  return events.find(
    (event) => deployer === undefined || isAddressEqual(event.args.deployer, deployer),
  )
}

/**
 * Extracts the deployed ExternalAccessControl address from a {@link buildSpawnAccessControlCall} transaction receipt.
 * @returns The deployed EAC address, or `null` if the event is not found
 */
export function extractAccessControlAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    accessControlFactoryAbi,
    'SpawnedExternalAccessControl',
    deployer,
  )

  return event?.args.eac ?? null
}

/**
 * Extracts the deployed FeeManager address from a {@link buildSpawnFeeManagerCall} transaction receipt.
 * @returns The deployed fee manager address, or `null` if the event is not found
 */
export function extractFeeManagerAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    feeManagerFactoryAbi,
    'SpawnedFeeManager',
    deployer,
  )

  return event?.args.feeManager ?? null
}

/**
 * Extracts the deployed AccountList address from a {@link buildSpawnAccountListCall} transaction receipt.
 * @returns The deployed account list address, or `null` if the event is not found
 */
export function extractAccountListAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    accountListFactoryAbi,
    'SpawnedAccountList',
    deployer,
  )

  return event?.args.accountList ?? null
}

/**
 * Extracts the deployed OwnerRegistry address from a {@link buildSpawnOwnerRegistryCall} transaction receipt.
 * @returns The deployed owner registry address, or `null` if the event is not found
 */
export function extractOwnerRegistryAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    ownerRegistryFactoryAbi,
    'SpawnedOwnerRegistry',
    deployer,
  )

  return event?.args.ownerRegistry ?? null
}

/**
 * Extracts the deployed Aave V3 Vehicle address from a {@link buildSpawnAaveV3VehicleCall} transaction receipt.
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractAaveV3VehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    aaveV3VehicleFactoryAbi,
    'SpawnedAaveV3Vehicle',
    deployer,
  )

  return event?.args.vehicle ?? null
}

/**
 * Extracts the deployed ERC-4626 Vehicle address from a {@link buildSpawnErc4626VehicleCall} receipt.
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractErc4626VehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    erc4626VehicleFactoryAbi,
    'SpawnedERC4626Vehicle',
    deployer,
  )
  return event?.args.vehicle ?? null
}

/**
 * Extracts the deployed Morpho Blue Vehicle address from a {@link buildSpawnMorphoBlueVehicleCall} receipt.
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractMorphoBlueVehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    morphoBlueVehicleFactoryAbi,
    'SpawnedMorphoBlueVehicle',
    deployer,
  )
  return event?.args.vehicle ?? null
}

/**
 * Extracts the deployed Wrapper Vehicle address from a {@link buildSpawnWrapperVehicleCall} receipt.
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractWrapperVehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
  deployer?: Address,
): Address | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    wrapperVehicleFactoryAbi,
    'SpawnedWrapperVehicle',
    deployer,
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
  deployer?: Address,
): MultiVehicleContracts | null {
  const event = spawnEvent(
    receipt,
    factoryAddress,
    multiVehicleFactoryAbi,
    'SpawnedMultiVehicle',
    deployer,
  )
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
  deployer?: Address,
): Address | null {
  const event = spawnEvent(receipt, factoryAddress, conduitFactoryAbi, 'ConduitDeployed', deployer)

  return event?.args.conduit ?? null
}

export type CreatedQuery = {
  queryId: Hex
  receiver: Address
}

/**
 * Extracts the queries a transaction created on a conduit, in log order, from its `QueryCreated`
 * events. A deposit's id is known before it is sent, see {@link toQueryId}; a redeem's query is
 * assembled on chain, so this is how to learn its id.
 *
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

export type CreatedQueryWithStruct = CreatedQuery & {
  query: Query
  vehicle: Address
}

/**
 * {@link extractQueryIds}, with each query's vehicle and `Query` struct from the QueryRegistry's
 * `Created` event. A struct is kept when {@link toQueryId} of it equals the conduit's id.
 *
 * @throws When a created query has no matching `Created` event in the receipt
 */
export function extractQueries(
  receipt: TransactionReceipt,
  conduit: Address,
  chainId: number,
): Array<CreatedQueryWithStruct> {
  const registered = new Map(
    parseEventLogs({ abi: queryRegistryAbi, eventName: 'Created', logs: receipt.logs }).map(
      (event) => [
        toQueryId({ chainId, vehicle: event.args.vehicle, query: event.args.query }),
        { query: event.args.query, vehicle: event.args.vehicle },
      ],
    ),
  )

  return extractQueryIds(receipt, conduit).map((created) => {
    const registration = registered.get(created.queryId)
    if (!registration) {
      throw new Error(`query ${created.queryId} has no matching Created event on chain ${chainId}`)
    }
    return { ...created, ...registration }
  })
}
