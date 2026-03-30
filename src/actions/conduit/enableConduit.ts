import type { Address, Client, Hash } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { conduitAbi } from '../../abi/conduit.js'

export type EnableConduitParameters = {
  conduit: Address
}

export async function enableConduit(
  client: Client,
  parameters: EnableConduitParameters & { account: Address },
): Promise<Hash> {
  const { request } = await simulateContract(client, {
    address: parameters.conduit,
    abi: conduitAbi,
    functionName: 'enable',
    args: [],
    account: parameters.account,
  })

  return writeContract(client, request)
}
