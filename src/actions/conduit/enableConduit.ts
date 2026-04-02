import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'
import type { ContractCallOptions } from '../../types.js'

export type EnableConduitParameters = {
  conduit: Address
}

export async function enableConduit(
  client: Client,
  parameters: EnableConduitParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    ...options,
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
    account: parameters.account,
  })

  return writeContract(client, request)
}
