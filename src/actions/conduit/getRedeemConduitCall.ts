import type { Client, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import { toQuerySalt } from './queryId.js'
import { type BuildRedeemConduitCallParameters, buildRedeemConduitCall } from './redeemConduit.js'
import type { Asset } from './types.js'

export type GetRedeemConduitCallParameters = Omit<
  BuildRedeemConduitCallParameters,
  'outputAsset'
> & {
  /** Derived from `conduit.asset()`, with no amount floor, when omitted. */
  outputAsset?: Asset
}

export type GetRedeemConduitCallReturnType = {
  /** Spread it into `simulateContract`, `writeContract`, or {@link toCall} for a batch. */
  call: ReturnType<typeof buildRedeemConduitCall>
  /**
   * The `query.salt` the redeem will carry. The conduit assembles the rest of the query at the
   * share ratio of the including block, so unlike a deposit the id is not knowable in advance —
   * join an indexer on this, or read the id back with {@link extractQueryIds}.
   */
  querySalt: Hex
  outputAsset: Asset
}

/**
 * Resolves what a redeem needs from chain — the conduit's underlying asset — and returns the call
 * along with the salt the created query will carry. Reads only; sending the call is yours.
 *
 * @param parameters - {@link GetRedeemConduitCallParameters}
 */
export async function getRedeemConduitCall(
  client: Client,
  parameters: GetRedeemConduitCallParameters,
): Promise<GetRedeemConduitCallReturnType> {
  const outputAsset: Asset = parameters.outputAsset ?? {
    asset: await readContract(client, {
      address: parameters.conduit,
      abi: conduitAbi,
      functionName: 'asset',
    }),
    value: 0n,
  }

  return {
    call: buildRedeemConduitCall({ ...parameters, outputAsset }),
    querySalt: toQuerySalt({ sender: parameters.sender, salt: parameters.salt }),
    outputAsset,
  }
}
