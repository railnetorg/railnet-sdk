import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitFactoryAbi } from '../../abi/conduitFactory.js'

export type FinalizeConduitDepositParameters = {
  factory: Address
  conduit: Address
}

export async function finalizeConduitDeposit(
  client: Client,
  parameters: FinalizeConduitDepositParameters & { account: Address },
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    address: parameters.factory,
    abi: conduitFactoryAbi,
    functionName: 'finalizeConduitDeposit',
    args: [parameters.conduit],
    account: parameters.account,
  })

  return writeContract(client, request)
}
