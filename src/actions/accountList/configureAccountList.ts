import { type Address, zeroAddress } from 'viem'
import { accountListAbi } from '../../abi/accountList.js'
import type { AllowlistMode } from './types.js'

export type SetAllowlistModeParameters = {
  accountList: Address
  mode: AllowlistMode
}

/**
 * Switches which operations consult the allow-list; the lists themselves do not change. Reverts
 * `ModeUnchanged` when it already holds. Needs ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link SetAllowlistModeParameters}
 */
export function buildSetAllowlistModeCall(parameters: SetAllowlistModeParameters) {
  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'setAllowlistMode',
    args: [parameters.mode],
  } as const
}

export type UpdateAccountListParameters = {
  accountList: Address
  accounts: readonly Address[]
}

/**
 * The contract rejects a duplicate within the batch as readily as one already stored
 * (`AddressAlreadyListed` adding, `AddressNotListed` removing), and the zero address
 * (`ZeroAddress`). It has no length check either way, so an empty batch is a transaction that
 * succeeds having done nothing.
 *
 * @throws Error if the batch is empty, holds the zero address, or repeats an account
 */
function assertListedAccounts(accounts: readonly Address[]): void {
  if (accounts.length === 0) {
    throw new Error('accounts must not be empty')
  }

  const seen = new Set<string>()
  for (const account of accounts) {
    if (account === zeroAddress) {
      throw new Error('accounts must not hold the zero address')
    }
    const key = account.toLowerCase()
    if (seen.has(key)) {
      throw new Error(`accounts must not repeat an entry: ${account} appears twice`)
    }
    seen.add(key)
  }
}

/**
 * Reverts `AddressAlreadyListed` on a duplicate, `ZeroAddress` on
 * the zero address, and `AddressOnOtherList` on an account the block-list already holds. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 */
export function buildAddToAllowListCall(parameters: UpdateAccountListParameters) {
  assertListedAccounts(parameters.accounts)

  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'addToAllowList',
    args: [parameters.accounts],
  } as const
}

/**
 * Reverts `AddressNotListed` when an account is absent from the allow-list. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 * @throws Error if the batch is empty, holds the zero address, or repeats an account
 */
export function buildRemoveFromAllowListCall(parameters: UpdateAccountListParameters) {
  assertListedAccounts(parameters.accounts)

  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'removeFromAllowList',
    args: [parameters.accounts],
  } as const
}

/**
 * Blocks accounts from depositing, receiving and transferring. They keep the right to redeem, and
 * a CONDUIT_FORCE_REDEEM holder may redeem on their behalf. Reverts `AddressOnOtherList` on an
 * account the allow-list already holds. Needs ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 */
export function buildAddToBlockListCall(parameters: UpdateAccountListParameters) {
  assertListedAccounts(parameters.accounts)

  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'addToBlockList',
    args: [parameters.accounts],
  } as const
}

/**
 * Unblocks accounts. Reverts `AddressNotListed` when one is absent. Needs ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 * @throws Error if the batch is empty, holds the zero address, or repeats an account
 */
export function buildRemoveFromBlockListCall(parameters: UpdateAccountListParameters) {
  assertListedAccounts(parameters.accounts)

  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'removeFromBlockList',
    args: [parameters.accounts],
  } as const
}

export type ToggleSanctionsParameters = {
  accountList: Address
  enabled: boolean
}

/**
 * Turns sanctions screening on or off. Enabling needs an oracle (`SanctionsOracleRequired`), and
 * re-sending the current state reverts `SanctionsUnchanged`. Screening fails closed; an oracle
 * that reverts or returns anything other than 32 bytes marks the account sanctioned. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link ToggleSanctionsParameters}
 */
export function buildToggleSanctionsCall(parameters: ToggleSanctionsParameters) {
  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'toggleSanctions',
    args: [parameters.enabled],
  } as const
}

export type SetSanctionsOracleParameters = {
  accountList: Address
  oracle: Address
}

/**
 * Points screening at an ISanctionsList contract. A non-zero address is contract-checked, zero is
 * only accepted while screening is off, and the current oracle reverts `OracleUnchanged`. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link SetSanctionsOracleParameters}
 */
export function buildSetSanctionsOracleCall(parameters: SetSanctionsOracleParameters) {
  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'setSanctionsOracle',
    args: [parameters.oracle],
  } as const
}
