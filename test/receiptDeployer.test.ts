import { describe, expect, it } from 'bun:test'
import {
  type Abi,
  type Address,
  encodeAbiParameters,
  encodeEventTopics,
  getAbiItem,
  type TransactionReceipt,
  zeroAddress,
  zeroHash,
} from 'viem'
import { accessControlFactoryAbi } from '../src/abi/accessControlFactory.js'
import { accountListFactoryAbi } from '../src/abi/accountListFactory.js'
import { feeManagerFactoryAbi } from '../src/abi/feeManagerFactory.js'
import { ownerRegistryFactoryAbi } from '../src/abi/ownerRegistryFactory.js'
import { AllowlistMode } from '../src/actions/accountList/types.js'
import {
  extractAccessControlAddress,
  extractAccountListAddress,
  extractFeeManagerAddress,
  extractOwnerRegistryAddress,
} from '../src/utils/receipt.js'

const FACTORY: Address = '0x1111111111111111111111111111111111111111'
const SOMEONE_ELSE: Address = '0x2222222222222222222222222222222222222222'
const CALLER: Address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const THEIRS: Address = '0x4444444444444444444444444444444444444444'
const OURS: Address = '0x5555555555555555555555555555555555555555'
const ABSENT: Address = '0x6666666666666666666666666666666666666666'

const NO_FEES = { performanceFeeBps: 0, managementFeeBps: 0, depositFeeBps: 0, redeemFeeBps: 0 }

type Spawn = { abi: Abi; eventName: string; params: unknown }

const ACCESS_CONTROL: Spawn = {
  abi: accessControlFactoryAbi,
  eventName: 'SpawnedExternalAccessControl',
  params: {
    initialDelay: 0,
    initialDefaultAdmin: CALLER,
    initialRoles: [],
    deploymentSalt: zeroHash,
  },
}
const FEE_MANAGER: Spawn = {
  abi: feeManagerFactoryAbi,
  eventName: 'SpawnedFeeManager',
  params: {
    accessControl: zeroAddress,
    initialFees: NO_FEES,
    initialMaxFees: NO_FEES,
    initialRecipients: [],
    deploymentSalt: zeroHash,
  },
}
const ACCOUNT_LIST: Spawn = {
  abi: accountListFactoryAbi,
  eventName: 'SpawnedAccountList',
  params: {
    accessControl: zeroAddress,
    mode: AllowlistMode.OPEN,
    initialAllowList: [],
    initialBlockList: [],
    sanctionsEnabled: false,
    oracle: zeroAddress,
    deploymentSalt: zeroHash,
  },
}
const OWNER_REGISTRY: Spawn = {
  abi: ownerRegistryFactoryAbi,
  eventName: 'SpawnedOwnerRegistry',
  params: { symbol: 'RRQ', name: 'Railnet Requests', deploymentSalt: zeroHash },
}

function spawnLog({ abi, eventName, params }: Spawn, deployer: Address, deployed: Address) {
  const event = getAbiItem({ abi, name: eventName })
  if (event?.type !== 'event') throw new Error(`${eventName} is not an event`)
  return {
    address: FACTORY,
    topics: encodeEventTopics({ abi, eventName, args: { deployer } }),
    data: encodeAbiParameters(
      event.inputs.filter((input) => !input.indexed),
      [deployed, params],
    ),
  }
}

/** Someone else's spawn sits before the caller's, as in a bundle that carries both. */
function sharedTransaction(spawn: Spawn): TransactionReceipt {
  return {
    logs: [spawnLog(spawn, SOMEONE_ELSE, THEIRS), spawnLog(spawn, CALLER, OURS)],
  } as unknown as TransactionReceipt
}

describe('a spawn receipt shared with another deployer', () => {
  it('reads the access control the given deployer spawned, not the first one in the receipt', () => {
    const receipt = sharedTransaction(ACCESS_CONTROL)

    expect(extractAccessControlAddress(receipt, FACTORY, CALLER)).toBe(OURS)
    expect(extractAccessControlAddress(receipt, FACTORY)).toBe(THEIRS)
  })

  it('reads the fee manager the given deployer spawned, not the first one in the receipt', () => {
    const receipt = sharedTransaction(FEE_MANAGER)

    expect(extractFeeManagerAddress(receipt, FACTORY, CALLER)).toBe(OURS)
    expect(extractFeeManagerAddress(receipt, FACTORY)).toBe(THEIRS)
  })

  it('reads the account list the given deployer spawned, not the first one in the receipt', () => {
    const receipt = sharedTransaction(ACCOUNT_LIST)

    expect(extractAccountListAddress(receipt, FACTORY, CALLER)).toBe(OURS)
    expect(extractAccountListAddress(receipt, FACTORY)).toBe(THEIRS)
  })

  it('reads the owner registry the given deployer spawned, not the first one in the receipt', () => {
    const receipt = sharedTransaction(OWNER_REGISTRY)

    expect(extractOwnerRegistryAddress(receipt, FACTORY, CALLER)).toBe(OURS)
    expect(extractOwnerRegistryAddress(receipt, FACTORY)).toBe(THEIRS)
  })

  it('returns null when the given deployer spawned nothing, although the receipt holds a spawn', () => {
    expect(
      extractAccessControlAddress(sharedTransaction(ACCESS_CONTROL), FACTORY, ABSENT),
    ).toBeNull()
    expect(extractFeeManagerAddress(sharedTransaction(FEE_MANAGER), FACTORY, ABSENT)).toBeNull()
  })

  it('matches the deployer whatever its letter case', () => {
    const lowercased = CALLER.toLowerCase() as Address

    expect(extractAccountListAddress(sharedTransaction(ACCOUNT_LIST), FACTORY, lowercased)).toBe(
      OURS,
    )
  })
})
