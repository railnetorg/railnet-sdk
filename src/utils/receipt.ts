import type { Abi, Address, TransactionReceipt } from 'viem'
import { decodeEventLog } from 'viem'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'
import { multiVehicleFactoryAbi } from '../abi/multiVehicleFactory.js'

export function extractEventAddress<TAbi extends Abi>(
  receipt: TransactionReceipt,
  options: {
    abi: TAbi
    eventName: string
    fromAddress: Address
    argName: string
  },
): Address | null {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== options.fromAddress.toLowerCase()) {
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi: options.abi,
        data: log.data,
        topics: log.topics,
        eventName: options.eventName as never,
      })
      const args = decoded.args as unknown as Record<string, unknown>
      const address = args[options.argName]
      if (typeof address === 'string') {
        return address as Address
      }
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
