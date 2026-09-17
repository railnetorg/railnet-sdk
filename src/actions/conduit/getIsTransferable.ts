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
 * Whether the conduit would let `from` send shares to `to` — `conduit.isTransferable()`.
 *
 * Three conditions at once: transfers enabled on the conduit at all, and — when it has an account
 * list — neither party blocked or sanctioned, with both allow-listed under STRICT. The OwnerRegistry
 * consults the same predicate before it moves a wrapped query.
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
