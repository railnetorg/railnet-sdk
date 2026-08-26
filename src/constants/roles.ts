import type { Hex } from 'viem'
import { keccak256, toHex } from 'viem'

export const FACTORY_SPAWN = keccak256(toHex('FACTORY_SPAWN'))
export const FACTORY_DEPRECATE = keccak256(toHex('FACTORY_DEPRECATE'))
export const CONDUIT_SPAWN = keccak256(toHex('CONDUIT_SPAWN'))

export const ASSET_REGISTRY_SET_ASSET = keccak256(toHex('ASSET_REGISTRY_SET_ASSET'))

export const BEACON_FREEZE = keccak256(toHex('BEACON_FREEZE'))
export const BEACON_PAUSE = keccak256(toHex('BEACON_PAUSE'))
export const BEACON_UNPAUSE = keccak256(toHex('BEACON_UNPAUSE'))
export const BEACON_UPGRADE = keccak256(toHex('BEACON_UPGRADE'))

export const VEHICLE_PROCESS_QUEUE = keccak256(toHex('VEHICLE_PROCESS_QUEUE'))
export const VEHICLE_STEAM_DEPOSIT = keccak256(toHex('VEHICLE_STEAM_DEPOSIT'))
export const VEHICLE_STEAM_REDEEM = keccak256(toHex('VEHICLE_STEAM_REDEEM'))
export const VEHICLE_SET_INTERCEPTIONS = keccak256(toHex('VEHICLE_SET_INTERCEPTIONS'))
export const VEHICLE_ALLOW = keccak256(toHex('VEHICLE_ALLOW'))
export const VEHICLE_EXEC = keccak256(toHex('VEHICLE_EXEC'))

export const CONDUIT_SET_INTERCEPTIONS = keccak256(toHex('CONDUIT_SET_INTERCEPTIONS'))

export const FEE_MANAGER_SET_FEES = keccak256(toHex('FEE_MANAGER_SET_FEES'))
export const FEE_MANAGER_SET_FEE_RECIPIENTS = keccak256(toHex('FEE_MANAGER_SET_FEE_RECIPIENTS'))
export const FEE_MANAGER_DISPATCH_ERC20 = keccak256(toHex('FEE_MANAGER_DISPATCH_ERC20'))

export const MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE = keccak256(
  toHex('MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE'),
)
export const MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS = keccak256(
  toHex('MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS'),
)
export const MULTI_VEHICLE_SET_QUEUES = keccak256(toHex('MULTI_VEHICLE_SET_QUEUES'))
export const MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION = keccak256(
  toHex('MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION'),
)
export const MULTI_VEHICLE_MOVE = keccak256(toHex('MULTI_VEHICLE_MOVE'))
export const MULTI_VEHICLE_DEPOSIT = keccak256(toHex('MULTI_VEHICLE_DEPOSIT'))
export const MULTI_VEHICLE_DISPATCH = keccak256(toHex('MULTI_VEHICLE_DISPATCH'))
export const MULTI_VEHICLE_PROGRESS_QUERY = keccak256(toHex('MULTI_VEHICLE_PROGRESS_QUERY'))
export const MULTI_VEHICLE_SET_THRESHOLDS = keccak256(toHex('MULTI_VEHICLE_SET_THRESHOLDS'))

export const JOB_LISTING_REGISTER = keccak256(toHex('JOB_LISTING_REGISTER'))
export const JOB_LISTING_UNREGISTER = keccak256(toHex('JOB_LISTING_UNREGISTER'))
export const JOB_LISTING_EXECUTE = keccak256(toHex('JOB_LISTING_EXECUTE'))

export const MODULE_MANAGER = keccak256(toHex('MODULE_MANAGER'))

export const ACCOUNT_LIST_MANAGER = keccak256(toHex('ACCOUNT_LIST_MANAGER'))
export const CONDUIT_FORCE_REDEEM = keccak256(toHex('CONDUIT_FORCE_REDEEM'))
export const CONDUIT_SET_TRANSFER_ENABLED = keccak256(toHex('CONDUIT_SET_TRANSFER_ENABLED'))
export const CONDUIT_PROCESS = keccak256(toHex('CONDUIT_PROCESS'))

export const KEEPER_ON_REPORT = keccak256(toHex('KEEPER_ON_REPORT'))

export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as const

/**
 * Every role the protocol defines, as `{ name, hash }`.
 *
 * @example
 * import { ROLES } from '@railnetorg/railnet-sdk'
 *
 * const options = ROLES.map((role) => ({ label: role.name, value: role.hash }))
 */
export const ROLES = [
  { name: 'FACTORY_SPAWN', hash: FACTORY_SPAWN },
  { name: 'FACTORY_DEPRECATE', hash: FACTORY_DEPRECATE },
  { name: 'CONDUIT_SPAWN', hash: CONDUIT_SPAWN },
  { name: 'ASSET_REGISTRY_SET_ASSET', hash: ASSET_REGISTRY_SET_ASSET },
  { name: 'BEACON_FREEZE', hash: BEACON_FREEZE },
  { name: 'BEACON_PAUSE', hash: BEACON_PAUSE },
  { name: 'BEACON_UNPAUSE', hash: BEACON_UNPAUSE },
  { name: 'BEACON_UPGRADE', hash: BEACON_UPGRADE },
  { name: 'VEHICLE_PROCESS_QUEUE', hash: VEHICLE_PROCESS_QUEUE },
  { name: 'VEHICLE_STEAM_DEPOSIT', hash: VEHICLE_STEAM_DEPOSIT },
  { name: 'VEHICLE_STEAM_REDEEM', hash: VEHICLE_STEAM_REDEEM },
  { name: 'VEHICLE_SET_INTERCEPTIONS', hash: VEHICLE_SET_INTERCEPTIONS },
  { name: 'VEHICLE_ALLOW', hash: VEHICLE_ALLOW },
  { name: 'VEHICLE_EXEC', hash: VEHICLE_EXEC },
  { name: 'CONDUIT_SET_INTERCEPTIONS', hash: CONDUIT_SET_INTERCEPTIONS },
  { name: 'FEE_MANAGER_SET_FEES', hash: FEE_MANAGER_SET_FEES },
  { name: 'FEE_MANAGER_SET_FEE_RECIPIENTS', hash: FEE_MANAGER_SET_FEE_RECIPIENTS },
  { name: 'FEE_MANAGER_DISPATCH_ERC20', hash: FEE_MANAGER_DISPATCH_ERC20 },
  { name: 'MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE', hash: MULTI_VEHICLE_FEED_QUERY_REDEEM_QUEUE },
  {
    name: 'MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS',
    hash: MULTI_VEHICLE_RETRIEVE_QUERY_REDEEM_QUEUE_ASSETS,
  },
  { name: 'MULTI_VEHICLE_SET_QUEUES', hash: MULTI_VEHICLE_SET_QUEUES },
  {
    name: 'MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION',
    hash: MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION,
  },
  { name: 'MULTI_VEHICLE_MOVE', hash: MULTI_VEHICLE_MOVE },
  { name: 'MULTI_VEHICLE_DEPOSIT', hash: MULTI_VEHICLE_DEPOSIT },
  { name: 'MULTI_VEHICLE_DISPATCH', hash: MULTI_VEHICLE_DISPATCH },
  { name: 'MULTI_VEHICLE_PROGRESS_QUERY', hash: MULTI_VEHICLE_PROGRESS_QUERY },
  { name: 'MULTI_VEHICLE_SET_THRESHOLDS', hash: MULTI_VEHICLE_SET_THRESHOLDS },
  { name: 'JOB_LISTING_REGISTER', hash: JOB_LISTING_REGISTER },
  { name: 'JOB_LISTING_UNREGISTER', hash: JOB_LISTING_UNREGISTER },
  { name: 'JOB_LISTING_EXECUTE', hash: JOB_LISTING_EXECUTE },
  { name: 'MODULE_MANAGER', hash: MODULE_MANAGER },
  { name: 'ACCOUNT_LIST_MANAGER', hash: ACCOUNT_LIST_MANAGER },
  { name: 'CONDUIT_FORCE_REDEEM', hash: CONDUIT_FORCE_REDEEM },
  { name: 'CONDUIT_SET_TRANSFER_ENABLED', hash: CONDUIT_SET_TRANSFER_ENABLED },
  { name: 'CONDUIT_PROCESS', hash: CONDUIT_PROCESS },
  { name: 'KEEPER_ON_REPORT', hash: KEEPER_ON_REPORT },
  { name: 'DEFAULT_ADMIN_ROLE', hash: DEFAULT_ADMIN_ROLE },
] as const satisfies readonly { name: string; hash: Hex }[]

const NAME_BY_HASH: ReadonlyMap<Hex, string> = new Map(ROLES.map((role) => [role.hash, role.name]))

/**
 * Resolves a role hash back to its name.
 *
 * @returns The role name, or `null` if the hash is not a protocol role
 *
 * @example
 * import { roleName, VEHICLE_STEAM_DEPOSIT } from '@railnetorg/railnet-sdk'
 *
 * roleName(VEHICLE_STEAM_DEPOSIT) // 'VEHICLE_STEAM_DEPOSIT'
 * roleName('0xdead')              // null
 */
export function roleName(hash: Hex): string | null {
  return NAME_BY_HASH.get(hash) ?? null
}
