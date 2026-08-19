import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export function prepareFinalizeConduitDeposit(parameters: FinalizeConduitDepositParameters) {
  return {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
  } as const
}

/**
 * Finalizes the initial deposit on a conduit with an async vehicle (e.g. Ethena, Syrup). Called via the ConduitFactory after the vehicle's async query resolves.
 * @param client - Viem client instance
 * @param parameters - Factory and conduit addresses, plus caller account
 * @param options - Optional contract call overrides
 * @returns Transaction hash
 */
export async function finalizeConduitDeposit(
  client: Client,
  parameters: FinalizeConduitDepositParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    ...prepareFinalizeConduitDeposit(parameters),
    account: parameters.account,
  })

  return writeContract(client, request)
}
