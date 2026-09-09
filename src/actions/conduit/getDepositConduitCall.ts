import type { Address, Client, Hex } from 'viem'
import { getChainId, readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { Query } from '../../types.js'
import {
  type BuildDepositConduitCallParameters,
  buildDepositConduitCall,
} from './depositConduit.js'
import { toQueryId } from './queryId.js'

export type GetDepositConduitCallParameters = Omit<BuildDepositConduitCallParameters, 'vehicle'> & {
  /** Read from `conduit.getVehicle()` when omitted. */
  vehicle?: Address
}

export type GetDepositConduitCallReturnType = {
  /** Spread it into `simulateContract`, `writeContract`, or {@link toCall} for a batch. */
  call: ReturnType<typeof buildDepositConduitCall>
  query: Query
  /** The id the deposit will be created under, known before the transaction is sent. */
  queryId: Hex
  vehicle: Address
}

/**
 * Resolves what a deposit needs from chain — the conduit's vehicle — and returns the call along
 * with the identity of the query it will create. Reads only; sending the call is yours.
 *
 * @param parameters - {@link GetDepositConduitCallParameters}
 *
 * @example
 * import { getDepositConduitCall, randomSalt } from '@railnetorg/railnet-sdk'
 *
 * const { call, queryId } = await getDepositConduitCall(publicClient, {
 *   conduit,
 *   token: usdc,
 *   amount: 1_000_000n,
 *   sender: account.address,
 *   salt: randomSalt(),
 * })
 */
export async function getDepositConduitCall(
  client: Client,
  parameters: GetDepositConduitCallParameters,
): Promise<GetDepositConduitCallReturnType> {
  const [vehicle, chainId] = await Promise.all([
    parameters.vehicle ??
      readContract(client, {
        address: parameters.conduit,
        abi: conduitAbi,
        functionName: 'getVehicle',
      }),
    client.chain?.id ?? getChainId(client),
  ])

  const call = buildDepositConduitCall({ ...parameters, vehicle })
  const [query] = call.args

  return { call, query, queryId: toQueryId({ chainId, vehicle, query }), vehicle }
}
