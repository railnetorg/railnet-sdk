import type { Address, TransactionReceipt } from 'viem'
import { decodeEventLog } from 'viem'
import { conduitFactoryAbi } from '../abi/conduitFactory.js'

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
    } catch {}
  }

  return null
}
