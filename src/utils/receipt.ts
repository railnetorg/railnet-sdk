import type { Address, TransactionReceipt } from 'viem'
import { decodeEventLog } from 'viem'
import { aaveV3VehicleFactoryAbi } from '../abi/aaveV3VehicleFactory.js'
import { accessControlFactoryAbi } from '../abi/accessControlFactory.js'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'
import { multiVehicleFactoryAbi } from '../abi/multiVehicleFactory.js'

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

export function extractConduitDeployedAddress(
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
