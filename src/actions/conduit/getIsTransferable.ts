import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type GetIsTransferableParameters = {
  conduit: Address
  from: Address
  to: Address
}

export type GetIsTransferableReturnType = boolean

/**
 * Whether `conduit.isTransferable()` would let `from` send shares to `to`. Transfers have to be
 * enabled on the conduit, and its account list has to clear both parties.
 *
 * @param parameters - {@link GetIsTransferableParameters}
 *
 * @example
 * import { getIsTransferable } from '@railnetorg/railnet-sdk'
 *
 * if (!(await getIsTransferable(publicClient, { conduit, from, to }))) return refuse()
 */
export async function getIsTransferable(
  client: Client,
  parameters: GetIsTransferableParameters,
): Promise<GetIsTransferableReturnType> {
  return readContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'isTransferable',
    args: [parameters.from, parameters.to],
  })
}
