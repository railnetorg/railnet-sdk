import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'
import type { ContractCallOptions } from '../../types.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export async function finalizeConduitDeposit(
  client: Client,
  parameters: FinalizeConduitDepositParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
    account: parameters.account,
  })

  return writeContract(client, request)
}
