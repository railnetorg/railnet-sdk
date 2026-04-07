import type { Address, TransactionReceipt } from 'viem'
import { decodeEventLog } from 'viem'
import { aaveV3VehicleFactoryAbi } from '../abi/aaveV3VehicleFactory.js'
import { accessControlFactoryAbi } from '../abi/accessControlFactory.js'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'
import { multiVehicleFactoryAbi } from '../abi/multiVehicleFactory.js'

/**
 * Extracts the deployed ExternalAccessControl address from a {@link spawnAccessControl} transaction receipt.
 * @param receipt - The transaction receipt from the spawn call
 * @param factoryAddress - The AccessControlFactory address used for the spawn
 * @returns The deployed EAC address, or `null` if the event is not found
 */
export function extractAccessControlAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) {
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi: accessControlFactoryAbi,
        data: log.data,
        topics: log.topics,
        eventName: 'SpawnedExternalAccessControl',
      })
      return decoded.args.eac
    } catch {
      /* skip non-matching log */
    }
  }

  return null
}

/**
 * Extracts the deployed Aave V3 Vehicle address from a {@link spawnAaveV3Vehicle} transaction receipt.
 * @param receipt - The transaction receipt from the spawn call
 * @param factoryAddress - The AaveV3VehicleFactory address used for the spawn
 * @returns The deployed vehicle address, or `null` if the event is not found
 */
export function extractAaveV3VehicleAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) {
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi: aaveV3VehicleFactoryAbi,
        data: log.data,
        topics: log.topics,
        eventName: 'SpawnedAaveV3Vehicle',
      })
      return decoded.args.vehicle
    } catch {
      /* skip non-matching log */
    }
  }

  return null
}

export type MultiVehicleContracts = {
  multiVehicle: Address
  queryRedeemQueue: Address
  queueStrategyEngine: Address
  sectorAccountingEngine: Address
  subQueryEngine: Address
  vehicleRegistry: Address
}

/**
 * Extracts all deployed multi-vehicle contract addresses from a {@link spawnMultiVehicle} transaction receipt.
 * @param receipt - The transaction receipt from the spawn call
 * @param factoryAddress - The MultiVehicleFactory address used for the spawn
 * @returns All deployed contract addresses (multiVehicle, queryRedeemQueue, queueStrategyEngine, etc.), or `null` if the event is not found
 */
export function extractMultiVehicleContracts(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): MultiVehicleContracts | null {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) {
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi: multiVehicleFactoryAbi,
        data: log.data,
        topics: log.topics,
        eventName: 'SpawnedMultiVehicle',
      })
      return {
        multiVehicle: decoded.args.contracts.multiVehicle,
        queryRedeemQueue: decoded.args.contracts.queryRedeemQueue,
        queueStrategyEngine: decoded.args.contracts.queueStrategyEngine,
        sectorAccountingEngine: decoded.args.contracts.sectorAccountingEngine,
        subQueryEngine: decoded.args.contracts.subQueryEngine,
        vehicleRegistry: decoded.args.contracts.vehicleRegistry,
      }
    } catch {
      /* skip non-matching log */
    }
  }

  return null
}

/**
 * Extracts the deployed conduit address from a {@link spawnConduit} transaction receipt.
 * @param receipt - The transaction receipt from the spawn call
 * @param factoryAddress - The ConduitFactory address used for the spawn
 * @returns The deployed conduit address, or `null` if the event is not found
 */
export function extractConduitAddress(
  receipt: TransactionReceipt,
  factoryAddress: Address,
): Address | null {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) {
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi: conduitFactoryAbi,
        data: log.data,
        topics: log.topics,
        eventName: 'ConduitDeployed',
      })
      return decoded.args.conduit
    } catch {
      /* skip non-matching log */
    }
  }

  return null
}
