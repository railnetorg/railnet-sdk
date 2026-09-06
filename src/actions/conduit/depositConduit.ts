import { type Address, encodeAbiParameters, type Hex, keccak256 } from 'viem'
import { conduitAbi } from '../../abi/conduit.js'
import { ConduitMode } from './types.js'

export type DepositConduitParameters = {
  conduit: Address
  token: Address
  amount: bigint
  receiver?: Address
  vehicle?: Address
  /** Floor on the vehicle shares the deposit must produce. Omitted accepts any output. */
  minOutput?: bigint
  /** Derives `minOutput` from the vehicle's estimate, this far below it. Ignored when `minOutput` is set. */
  slippageBps?: number
  salt?: Hex
}

export type PrepareDepositConduitParameters = Omit<
  DepositConduitParameters,
  'salt' | 'slippageBps'
> & {
  account: Address
  vehicle: Address
  salt: Hex
}

/**
 * Deposits into a Conduit by calling `conduit.create()`. On synchronous vehicles (Aave V3, Compound, etc.) the deposit executes immediately. On async vehicles (STEAM) it creates a pending query. Automatically approves the deposit token if the current allowance is insufficient, and reads `conduit.getVehicle()` to name the query's output asset unless `vehicle` is supplied.
 *
 * Returns the call to send. Hand it to viem's `simulateContract` then `writeContract`,
 * or to wagmi's `useWriteContract`.
 *
 * @param parameters - {@link DepositConduitParameters}
 */
export function prepareDepositConduit(parameters: PrepareDepositConduitParameters) {
  const { conduit, token, amount, account, vehicle, minOutput, salt: sourceSalt } = parameters
  const receiver = parameters.receiver ?? account

  const query = {
    owner: conduit,
    receiver: conduit,
    input: { asset: token, value: amount },
    // BaseVehicle._validateOutput reverts unless a DEPOSIT names the vehicle as its output asset.
    // The value is a floor, checked as `query.output.value > estimate` at create time; 0 sets none.
    output: { asset: vehicle, value: minOutput ?? 0n },
    mode: ConduitMode.DEPOSIT,
    // conduit.create() reverts unless query.salt == keccak256(abi.encode(msg.sender, sourceSalt))
    salt: keccak256(
      encodeAbiParameters([{ type: 'address' }, { type: 'bytes32' }], [account, sourceSalt]),
    ),
    data: '0x' as const,
  }

  return {
    address: conduit,
    abi: conduitAbi,
    functionName: 'create',
    args: [query, receiver, sourceSalt],
  } as const
}
