import {
  type Address,
  type Client,
  encodeAbiParameters,
  erc20Abi,
  type Hash,
  type Hex,
  keccak256,
  toHex,
} from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'
import { ConduitMode } from './types.js'

export type DepositConduitParameters = {
  conduit: Address
  token: Address
  amount: bigint
  receiver?: Address
  vehicle?: Address
  salt?: Hex
}

export type PrepareDepositConduitParameters = DepositConduitParameters & {
  account: Address
  vehicle: Address
}

export function prepareDepositConduit(parameters: PrepareDepositConduitParameters) {
  const { conduit, token, amount, account, vehicle } = parameters
  const receiver = parameters.receiver ?? account
  const sourceSalt = parameters.salt ?? keccak256(toHex(`deposit-${account}-${Date.now()}`))

  const query = {
    owner: conduit,
    receiver: conduit,
    input: { asset: token, value: amount },
    // BaseVehicle._validateOutput reverts unless a DEPOSIT names the vehicle as its output asset;
    // a zero value leaves the output floor unbounded
    output: { asset: vehicle, value: 0n },
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

/**
 * Deposits into a Conduit by calling `conduit.create()`. On synchronous vehicles (Aave V3, Compound, etc.) the deposit executes immediately. On async vehicles (STEAM) it creates a pending query. Automatically approves the deposit token if the current allowance is insufficient, and reads `conduit.getVehicle()` to name the query's output asset unless `vehicle` is supplied.
 *
 * @param parameters - {@link DepositConduitParameters}
 *
 * @example
 * import { depositConduit, getAddresses } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { usdc } = getAddresses(base.id)
 *
 * const hash = await depositConduit(walletClient, {
 *   conduit: conduitAddress,
 *   token: usdc,
 *   amount: 1_000_000n,
 *   account: account.address,
 * })
 */
export async function depositConduit(
  client: Client,
  parameters: DepositConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { conduit, token, amount, account } = parameters

  const [allowance, vehicle] = await Promise.all([
    readContract(client, {
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, conduit],
    }),
    parameters.vehicle ??
      readContract(client, { address: conduit, abi: conduitAbi, functionName: 'getVehicle' }),
  ])

  if (allowance < amount) {
    const { request: approveRequest } = await simulateContract(client, {
      ...options,
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [conduit, amount],
      account,
    })
    const approveHash = await writeContract(client, approveRequest)
    await waitForTransactionReceipt(client, { hash: approveHash })
  }

  const { request: depositRequest } = await simulateContract(client, {
    ...options,
    ...prepareDepositConduit({ ...parameters, vehicle }),
    account,
  })

  return writeContract(client, depositRequest)
}
