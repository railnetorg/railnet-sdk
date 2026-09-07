import {
  type Address,
  type Client,
  encodeAbiParameters,
  erc20Abi,
  type Hash,
  type Hex,
  keccak256,
} from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'
import { randomSalt } from '../../utils/salt.js'
import { applySlippage, estimateVehicle } from '../vehicle/estimateVehicle.js'
import { EstimationType } from './estimateConduit.js'
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

  const { slippageBps, ...depositParameters } = parameters
  const minOutput =
    parameters.minOutput ??
    (slippageBps === undefined
      ? undefined
      : applySlippage(
          (
            await estimateVehicle(client, {
              vehicle,
              asset: { asset: token, value: amount },
              mode: ConduitMode.DEPOSIT,
              estimationType: EstimationType.OUTPUT,
            })
          ).value,
          slippageBps,
        ))

  const { request: depositRequest } = await simulateContract(client, {
    ...options,
    ...prepareDepositConduit({
      ...depositParameters,
      vehicle,
      ...(minOutput === undefined ? {} : { minOutput }),
      salt: parameters.salt ?? randomSalt(),
    }),
    account,
  })

  return writeContract(client, depositRequest)
}
