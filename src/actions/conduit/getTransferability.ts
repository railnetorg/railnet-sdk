import type { Address, Client } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type GetTransferabilityParameters = {
  conduit: Address
  from: Address
  to: Address
}

export type GetTransferabilityReturnType = boolean

/**
 * Whether the conduit would let `from` send shares to `to`.
 *
 * One predicate over three conditions: transfers enabled on the conduit at all, and — when it has
 * an account list — neither party blocked or sanctioned, with both allow-listed under STRICT. The
 * conduit exposes no flag for the first of those on its own, so this is the only way to read the
 * transfer policy, and the same predicate the OwnerRegistry consults before moving a wrapped query.
 *
 * A pair is required because the answer is not a property of the conduit: the same conduit is
 * transferable for one pair and not another.
 *
 * @param parameters - {@link GetTransferabilityParameters}
 *
 * @example
 * import { getTransferability } from '@railnetorg/railnet-sdk'
 *
 * if (!(await getTransferability(publicClient, { conduit, from, to }))) return refuse()
 */
export async function getTransferability(
  client: Client,
  parameters: GetTransferabilityParameters,
): Promise<GetTransferabilityReturnType> {
  return readContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'isTransferable',
    args: [parameters.from, parameters.to],
  })
}
