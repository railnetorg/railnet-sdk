import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { morphoBlueVehicleAbi } from '../../abi/morphoBlueVehicle.js'
import { morphoBlueVehicleFactoryAbi } from '../../abi/morphoBlueVehicleFactory.js'

export type GetMorphoBlueSingletonParameters = {
  factory: Address
}

export type GetMorphoBlueSingletonReturnType = Address

/**
 * The Morpho Blue singleton a MorphoBlueVehicleFactory will accept.
 *
 * `spawn` reverts unless its `morpho` argument matches the factory implementation's own immutable
 * `MORPHO`, so this is the only value that works — resolving it in two reads (factory's
 * `IMPLEMENTATION`, then that clone's `MORPHO`) spares a caller from hardcoding a protocol address.
 *
 * @param parameters - {@link GetMorphoBlueSingletonParameters}
 */
export async function getMorphoBlueSingleton(
  client: Client,
  parameters: GetMorphoBlueSingletonParameters,
): Promise<GetMorphoBlueSingletonReturnType> {
  const implementation = await readContract(client, {
    address: parameters.factory,
    abi: morphoBlueVehicleFactoryAbi,
    functionName: 'IMPLEMENTATION',
  })

  return await readContract(client, {
    address: implementation,
    abi: morphoBlueVehicleAbi,
    functionName: 'MORPHO',
  })
}
