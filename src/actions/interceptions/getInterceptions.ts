import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { baseVehicleAbi } from '../../abi/baseVehicle.js'
import { conduitAbi } from '../../abi/conduit.js'
import type { Interception } from '../../types.js'

export type GetInterceptionsReturnType = Interception[]

export type GetConduitInterceptionsParameters = {
  conduit: Address
}

/**
 * Reads the interception rules `buildSetConduitInterceptionsCall` stores, in the order the
 * contract holds them. An empty array means no flow is routed away.
 *
 * @param parameters - {@link GetConduitInterceptionsParameters}
 *
 * @example
 * import { getConduitInterceptions } from '@railnetorg/railnet-sdk'
 *
 * const current = await getConduitInterceptions(publicClient, { conduit })
 */
export async function getConduitInterceptions(
  client: Client,
  parameters: GetConduitInterceptionsParameters,
): Promise<GetInterceptionsReturnType> {
  const stored = await readContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'interceptions',
  })

  return stored.map((interception) => ({
    ...interception,
    recipients: [...interception.recipients],
  }))
}

export type GetVehicleInterceptionsParameters = {
  vehicle: Address
}

/**
 * Reads the interception rules `buildSetVehicleInterceptionsCall` stores, in the order the
 * contract holds them. An empty array means no flow is routed away.
 *
 * @param parameters - {@link GetVehicleInterceptionsParameters}
 *
 * @example
 * import { getVehicleInterceptions } from '@railnetorg/railnet-sdk'
 *
 * const current = await getVehicleInterceptions(publicClient, { vehicle })
 */
export async function getVehicleInterceptions(
  client: Client,
  parameters: GetVehicleInterceptionsParameters,
): Promise<GetInterceptionsReturnType> {
  const stored = await readContract(client, {
    address: parameters.vehicle,
    abi: baseVehicleAbi,
    functionName: 'interceptions',
  })

  return stored.map((interception) => ({
    ...interception,
    recipients: [...interception.recipients],
  }))
}
