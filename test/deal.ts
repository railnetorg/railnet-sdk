import {
  type Account,
  type Address,
  type Client,
  type ExactPartial,
  encodeFunctionData,
  erc20Abi,
  numberToHex,
  type TransactionRequest,
} from 'viem'
import { readContract, setBalance, setStorageAt } from 'viem/actions'

type AccessListRpcSchema = {
  Method: 'eth_createAccessList'
  Parameters:
    | [transaction: ExactPartial<TransactionRequest>]
    | [transaction: ExactPartial<TransactionRequest>, block: string]
  ReturnType: {
    accessList: Array<{ address: Address; storageKeys: readonly `0x${string}`[] }>
    gasUsed: `0x${string}`
  }
}

export type DealParameters = {
  erc20?: Address | undefined
  account?: Account | Address | undefined
  amount: bigint
}

export type DealActions = {
  deal: (params: DealParameters) => Promise<void>
}

export function dealActions(client: Client): DealActions {
  return {
    deal: (params) => dealErc20(client, params),
  }
}

async function getBalanceOfStorageSlots(client: Client, token: Address, owner: Address) {
  const balanceOfCalldata = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner],
  })

  const { accessList } = await (
    client as never as {
      request: (args: AccessListRpcSchema) => Promise<AccessListRpcSchema['ReturnType']>
    }
  ).request({
    method: 'eth_createAccessList',
    params: [{ to: token, data: balanceOfCalldata }],
  } as unknown as AccessListRpcSchema)

  return accessList
}

async function tryOverrideSlot(
  client: Client,
  token: Address,
  owner: Address,
  contractAddress: Address,
  slot: `0x${string}`,
  encodedAmount: `0x${string}`,
  expectedBalance: bigint,
): Promise<boolean> {
  try {
    const simulatedBalance = await readContract(client, {
      abi: erc20Abi,
      address: token,
      functionName: 'balanceOf',
      args: [owner],
      stateOverride: [
        {
          address: contractAddress,
          stateDiff: [{ slot, value: encodedAmount }],
        },
      ],
    })

    if (simulatedBalance !== expectedBalance) return false

    await setStorageAt(client as never, {
      address: contractAddress,
      index: slot,
      value: encodedAmount,
    })
    return true
  } catch {
    return false
  }
}

async function dealErc20(client: Client, params: DealParameters) {
  const target =
    typeof params.account === 'string'
      ? params.account
      : (params.account ?? client.account)?.address
  if (!target) {
    throw new Error('deal: no account provided and no default account on client')
  }

  if (params.erc20 == null) {
    return setBalance(client as never, { address: target, value: params.amount })
  }

  const token = params.erc20
  const encodedAmount = numberToHex(params.amount, { size: 32 })
  const storageSlots = await getBalanceOfStorageSlots(client, token, target)

  for (const { address: contractAddress, storageKeys } of storageSlots) {
    for (const slot of storageKeys) {
      const overridden = await tryOverrideSlot(
        client,
        token,
        target,
        contractAddress,
        slot,
        encodedAmount,
        params.amount,
      )
      if (overridden) return
    }
  }

  throw new Error(`deal: could not find balanceOf storage slot for token ${token}`)
}
