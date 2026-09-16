import type { Address, Hex } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import { type Query, QueryMode } from '../../types.js'
import { toQuerySalt } from './queryId.js'

export type BuildDepositConduitCallParameters = {
  conduit: Address
  token: Address
  amount: bigint
  /**
   * The address that will send the transaction. `conduit.create()` binds the query salt to
   * `msg.sender`, so through a Safe, a batch or a relayer this is that contract, not the user.
   */
  sender: Address
  /** The vehicle the conduit deposits into, from `conduit.getVehicle()`. */
  vehicle: Address
  /** Caller-chosen entropy. It fixes the query's identity, so it is never generated for you. */
  salt: Hex
  /** Who receives the conduit shares. Defaults to `sender`. */
  receiver?: Address
  /**
   * Floor on the deposit's output, in VEHICLE shares, checked as `query.output.value > estimate` at
   * create time against the vehicle's own estimate; omitted sets none. Derive it from
   * {@link estimateVehicle} and {@link applySlippage}.
   *
   * Not from {@link estimateConduit}, which prices the same deposit in conduit shares — a different
   * denomination, so the floor it yields is looser or tighter depending on the share rate.
   *
   * It bounds the vehicle's output, never the conduit shares finally received, so it is not a
   * "minimum received".
   */
  minOutput?: bigint
}

/**
 * Builds the DEPOSIT query `conduit.create()` will be called with. Its id, and so the row an
 * indexer will hold, is {@link toQueryId} of this struct.
 *
 * @param parameters - {@link BuildDepositConduitCallParameters}
 */
export function buildDepositConduitQuery(parameters: BuildDepositConduitCallParameters): Query {
  const { conduit, token, amount, sender, vehicle, minOutput, salt } = parameters

  return {
    owner: conduit,
    receiver: conduit,
    input: { asset: token, value: amount },
    // BaseVehicle._validateOutput reverts unless a DEPOSIT names the vehicle as its output asset.
    output: { asset: vehicle, value: minOutput ?? 0n },
    mode: QueryMode.DEPOSIT,
    salt: toQuerySalt({ sender, salt }),
    data: '0x',
  }
}

/**
 * Builds the `conduit.create()` call for a DEPOSIT query. The conduit must already be approved to
 * pull the token. On a synchronous vehicle the deposit executes on send; on an async one it creates
 * a pending query.
 *
 * @param parameters - {@link BuildDepositConduitCallParameters}
 */
export function buildDepositConduitCall(parameters: BuildDepositConduitCallParameters) {
  return {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [
      buildDepositConduitQuery(parameters),
      parameters.receiver ?? parameters.sender,
      parameters.salt,
    ],
  } as const
}
