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
  /** The query the dispatch created, as {@link simulateDispatchVehicle} returned it. */
  query: Query
  /** Both destinations exactly as the dispatch carried them: they are part of the sub-query's id. */
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
 * one bit resolves to a different id and reverts `UnknownSubQuery` rather than progressing the
 * wrong thing.
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
 * in its own transaction. Needs MULTI_VEHICLE_PROGRESS_QUERY.
 *
 * This is what {@link simulateDispatchVehicle} means by keeping the query to progress it later. On
 * an async sub-vehicle the dispatch stops short of settlement and the proceeds do not reach the
 * destination sector until this runs; watch for them with {@link getSectorBalance}.
 *
 * One call can chain several transitions — the engine runs its handlers as a cascade — so the
 * returned state is not necessarily the next one. Repeat until it is terminal. A query already
 * finalized reverts `SubQueryAlreadyFinalized` rather than returning its state, which distinguishes
 * it from a sub-query the engine never issued (`UnknownSubQuery`).
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
