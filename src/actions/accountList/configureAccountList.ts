import type { Address } from 'viem'
import { accountListAbi } from '../../abi/accountList.js'
import type { AllowlistMode } from './types.js'

export type SetAllowlistModeParameters = {
  accountList: Address
  mode: AllowlistMode
}

/**
 * Switches which operations consult the allow-list. Safe at any time: the lists themselves do not
 * change. Reverts `ModeUnchanged` when it already holds. Needs ACCOUNT_LIST_MANAGER.
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
 * Adds accounts to the allow-list. Reverts `AddressAlreadyListed` on a duplicate, `ZeroAddress` on
 * the zero address, and `AddressOnOtherList` on an account the block-list already holds. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 */
export function buildAddToAllowListCall(parameters: UpdateAccountListParameters) {
  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'addToAllowList',
    args: [parameters.accounts],
  } as const
}

/**
 * Removes accounts from the allow-list. Reverts `AddressNotListed` when one is absent. Needs
 * ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 */
export function buildRemoveFromAllowListCall(parameters: UpdateAccountListParameters) {
  return {
    address: parameters.accountList,
    abi: accountListAbi,
    functionName: 'removeFromAllowList',
    args: [parameters.accounts],
  } as const
}

/**
 * Blocks accounts: they can no longer deposit, receive or transfer. They keep the right to redeem
 * their own position — only a sanctions hit takes that away — but blocking is also what lets a
 * CONDUIT_FORCE_REDEEM holder redeem on their behalf. Reverts `AddressOnOtherList` on an account
 * the allow-list already holds. Needs ACCOUNT_LIST_MANAGER.
 *
 * @param parameters - {@link UpdateAccountListParameters}
 */
export function buildAddToBlockListCall(parameters: UpdateAccountListParameters) {
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
 */
export function buildRemoveFromBlockListCall(parameters: UpdateAccountListParameters) {
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
 * Turns sanctions screening on or off. Enabling requires an oracle to be configured first
 * (`SanctionsOracleRequired`), and re-sending the current state reverts `SanctionsUnchanged`.
 * Screening fails closed: an oracle that reverts, or returns anything other than 32 bytes — an EOA
 * returns nothing — marks the account sanctioned, and a sanctioned account cannot even redeem.
 * Needs ACCOUNT_LIST_MANAGER.
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
