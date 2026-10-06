import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { baseVehicleAbi } from '../../abi/baseVehicle.js'
import type { Query, QueryState } from '../../types.js'

export type GetQueryStateParameters = {
  vehicle: Address
  query: Query
}

export type GetQueryStateReturnType = QueryState

/**
 * Reads `vehicle.state(query)`, where a query stands in its lifecycle. `EMPTY` for a query the
 * vehicle never created. For a redeem, {@link extractQueries} returns both parameters.
 *
 * @param parameters - {@link GetQueryStateParameters}
 */
export async function getQueryState(
  client: Client,
  parameters: GetQueryStateParameters,
): Promise<GetQueryStateReturnType> {
  return readContract(client, {
    address: parameters.vehicle,
    abi: baseVehicleAbi,
    functionName: 'state',
    args: [parameters.query],
  })
}
