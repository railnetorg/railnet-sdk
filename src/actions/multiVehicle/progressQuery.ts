import type { Address, Hex } from 'viem'
import { subQueryEngineAbi } from '../../abi/subQueryEngine.js'
import type { Sector } from '../../constants/sectors.js'
import type { Query } from '../../types.js'
import { toQueryId } from '../conduit/queryId.js'

export type ProgressQueryParameters = {
  subQueryEngine: Address
  chainId: number
  /** The sub-vehicle the dispatch targeted. */
  vehicle: Address
  /** The query the dispatch created, as `simulateDispatchVehicle` returned it. */
  query: Query
  /**
   * Both destinations exactly as the dispatch carried them; they are part of the sub-query's id.
   */
  settledDestination: Sector
  rejectedDestination: Sector
}

export type SubQuery = {
  vehicle: Address
  queryId: Hex
  settledDestination: Sector
  rejectedDestination: Sector
}

/**
 * Rebuilds the `SubQuery` the engine bound a dispatch to. Its id is
 * `keccak256(abi.encode(chainId, engine, subQuery))`, so a field that differs from the dispatch by
 * one bit resolves to a different id.
 *
 * @param parameters - {@link ProgressQueryParameters}
 */
export function toSubQuery(parameters: ProgressQueryParameters): SubQuery {
  return {
    vehicle: parameters.vehicle,
    queryId: toQueryId({
      chainId: parameters.chainId,
      vehicle: parameters.vehicle,
      query: parameters.query,
    }),
    settledDestination: parameters.settledDestination,
    rejectedDestination: parameters.rejectedDestination,
  }
}

/**
 * Builds the `subQueryEngine.progressQuery()` call, which advances a dispatch that did not settle
 * in its own transaction. Needs MULTI_VEHICLE_PROGRESS_QUERY scoped to the SubQueryEngine. Reverts
 * `UnknownSubQuery` when a field differs from the dispatch, `SubQueryAlreadyFinalized` once terminal.
 *
 * @param parameters - {@link ProgressQueryParameters}
 */
export function buildProgressQueryCall(parameters: ProgressQueryParameters) {
  return {
    address: parameters.subQueryEngine,
    abi: subQueryEngineAbi,
    functionName: 'progressQuery',
    args: [toSubQuery(parameters), parameters.query],
  } as const
}
