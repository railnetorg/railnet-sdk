import type { Address } from 'viem'
import { vehicleManagerAbi } from '../../abi/vehicleManager.js'

export type FeedQueryRedeemQueueParameters = {
  vehicleManager: Address
}

/**
 * Builds the `vehicleManager.feedQueryRedeemQueue()` call, which fulfills pending redeem requests
 * out of what the multi vehicle can currently withdraw. Needs MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE.
 *
 * The operator override of auto-fulfillment: it skips the `minSharesForAutoFulfill` threshold that
 * normally has to be crossed, so it is how a queue below that floor gets served. Reverts
 * `NothingToFulfill` when no request is redeemable against the current withdrawable balance —
 * stage liquidity into `SECTOR_AVAILABLE` first.
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
 * Builds the `vehicleManager.retrieveQueryRedeemQueueAssets()` call, which pulls assets back out of
 * the redeem queue and deposits them into `SECTOR_AVAILABLE`. Needs
 * MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS.
 *
 * No shares are minted against the deposit, so the amount raises the per-share rate for every
 * holder — the surplus is treated as yield and the performance fee is charged on it.
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
