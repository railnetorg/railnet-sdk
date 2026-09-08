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
 * Adds accounts to the allow-list. Reverts `AddressAlreadyListed` on a duplicate or the zero
 * address. Needs ACCOUNT_LIST_MANAGER.
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
 * Removes accounts from the allow-list. Reverts `AddressNotListed` when one is absent.
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
 * their own position — only a sanctions hit takes that away.
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
 * Unblocks accounts. Reverts `AddressNotListed` when one is absent.
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
 * (`SanctionsOracleRequired`). Screening fails closed: an oracle that reverts, or is an EOA, marks
 * the account sanctioned, and a sanctioned account cannot even redeem.
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
 * Points screening at an ISanctionsList contract. The address is contract-checked, and may only be
 * set to zero while screening is off.
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
