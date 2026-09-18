import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type FeedQueryRedeemQueueParameters = {
  vehicleManager: Address
}

/**
 * Builds the `vehicleManager.feedQueryRedeemQueue()` call, which fulfills pending redeem requests
 * out of the withdrawable balance. Needs MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE. Reverts
 * `NothingToFulfill` when no request is redeemable against it.
 *
 * @param parameters - {@link FeedQueryRedeemQueueParameters}
 */
export function buildFeedQueryRedeemQueueCall(parameters: FeedQueryRedeemQueueParameters) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'feedQueryRedeemQueue',
    args: [],
  } as const
}

export type RetrieveQueryRedeemQueueAssetsParameters = {
  vehicleManager: Address
  /** In the multi vehicle's asset units. */
  amount: bigint
}

/**
 * Builds the `vehicleManager.retrieveQueryRedeemQueueAssets()` call, which deposits `amount` into
 * `SECTOR_AVAILABLE`. Needs MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS.
 *
 * @param parameters - {@link RetrieveQueryRedeemQueueAssetsParameters}
 */
export function buildRetrieveQueryRedeemQueueAssetsCall(
  parameters: RetrieveQueryRedeemQueueAssetsParameters,
) {
  return {
    address: parameters.vehicleManager,
    abi: vehicleManagerAbi,
    functionName: 'retrieveQueryRedeemQueueAssets',
    args: [parameters.amount],
  } as const
}
