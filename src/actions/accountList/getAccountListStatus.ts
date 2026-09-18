import type { Address, Client } from 'viem'
import { multicall } from 'viem/actions'
import { accountListAbi } from '../../abi/accountList.js'
import type { AllowlistMode } from './types.js'

export type AccountListStatus = {
  /** Not blocked, not sanctioned, and allow-listed under `REGULAR` or `STRICT`. */
  canDeposit: boolean
  /** Sanctions alone gate a redeem, so a blocked holder still passes this. */
  canRedeem: boolean
  canReceive: boolean
  isAllowListed: boolean
  isBlocked: boolean
  /** Screening fails closed: an oracle that reverts or returns nothing marks the account sanctioned. */
  isSanctioned: boolean
  mode: AllowlistMode
}

export type GetAccountListStatusParameters = {
  accountList: Address
  account: Address
}

export type GetAccountListStatusReturnType = AccountListStatus

/**
 * Every verdict an AccountList holds on one account, in one multicall.
 *
 * @param parameters - {@link GetAccountListStatusParameters}
 *
 * @example
 * import { getAccountListStatus } from '@railnetorg/railnet-sdk'
 *
 * const status = await getAccountListStatus(publicClient, { accountList, account })
 * if (!status.canDeposit) return status.isSanctioned ? refuse() : requestAllowListing()
 */
export async function getAccountListStatus(
  client: Client,
  parameters: GetAccountListStatusParameters,
): Promise<GetAccountListStatusReturnType> {
  const { accountList, account } = parameters
  const call = { address: accountList, abi: accountListAbi } as const

  const [canDeposit, canRedeem, canReceive, isAllowListed, isBlocked, isSanctioned, mode] =
    await multicall(client, {
      contracts: [
        { ...call, functionName: 'canDeposit', args: [account] },
        { ...call, functionName: 'canRedeem', args: [account] },
        { ...call, functionName: 'canReceive', args: [account] },
        { ...call, functionName: 'isAllowListed', args: [account] },
        { ...call, functionName: 'isBlocked', args: [account] },
        { ...call, functionName: 'isSanctioned', args: [account] },
        { ...call, functionName: 'mode' },
      ] as const,
      allowFailure: false,
    })

  return { canDeposit, canRedeem, canReceive, isAllowListed, isBlocked, isSanctioned, mode }
}
