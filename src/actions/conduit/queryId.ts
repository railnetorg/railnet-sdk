import { type Address, encodeAbiParameters, type Hex, keccak256 } from 'viem'
import type { Query } from '../../types.js'

/** The `Query` struct as `abi.encode` lays it out. */
export const queryAbiParameter = {
  type: 'tuple',
  components: [
    { name: 'owner', type: 'address' },
    { name: 'receiver', type: 'address' },
    {
      name: 'input',
      type: 'tuple',
      components: [
        { name: 'asset', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
    },
    {
      name: 'output',
      type: 'tuple',
      components: [
        { name: 'asset', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
    },
    { name: 'mode', type: 'uint8' },
    { name: 'salt', type: 'bytes32' },
    { name: 'data', type: 'bytes' },
  ],
} as const

export type ToQuerySaltParameters = {
  /** The address that will send the transaction, `msg.sender`. */
  sender: Address
  /** The caller-chosen entropy handed to `conduit.create()` as `sourceSalt`. */
  salt: Hex
}

/**
 * Derives the `query.salt` the conduit requires, `keccak256(abi.encode(sender, salt))`. A call
 * built for one sender reverts `InvalidQuerySalt` when another sends it.
 *
 * @param parameters - {@link ToQuerySaltParameters}
 */
export function toQuerySalt(parameters: ToQuerySaltParameters): Hex {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'address' }, { type: 'bytes32' }],
      [parameters.sender, parameters.salt],
    ),
  )
}

export type ToQueryIdParameters = {
  chainId: number
  vehicle: Address
  query: Query
}

/**
 * Computes the id a query is created under, `keccak256(abi.encode(chainId, vehicle, query))`. It
 * is the value `QueryCreated` carries, known before a deposit is sent. A redeem's query is
 * assembled at the share ratio of the including block, so {@link extractQueryIds} reads its id
 * from the receipt.
 *
 * @param parameters - {@link ToQueryIdParameters}
 */
export function toQueryId(parameters: ToQueryIdParameters): Hex {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'address' }, queryAbiParameter],
      [BigInt(parameters.chainId), parameters.vehicle, parameters.query],
    ),
  )
}
