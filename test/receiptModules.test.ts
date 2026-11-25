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
import { accountListFactoryAbi } from '../src/abi/accountListFactory.js'
import { feeManagerFactoryAbi } from '../src/abi/feeManagerFactory.js'
import { ownerRegistryFactoryAbi } from '../src/abi/ownerRegistryFactory.js'
import { AllowlistMode } from '../src/actions/accountList/types.js'
import {
  extractAccountListAddress,
  extractFeeManagerAddress,
  extractOwnerRegistryAddress,
} from '../src/utils/receipt.js'

const FACTORY: Address = '0x1111111111111111111111111111111111111111'
const OTHER_CONTRACT: Address = '0x2222222222222222222222222222222222222222'
const DEPLOYER: Address = '0x3333333333333333333333333333333333333333'
const DEPLOYED: Address = '0x4444444444444444444444444444444444444444'

const NO_FEES = { performanceFeeBps: 0, managementFeeBps: 0, depositFeeBps: 0, redeemFeeBps: 0 }

type SpawnLogArgs = { abi: Abi; eventName: string; emitter: Address; unindexed: readonly unknown[] }

function receiptWithSpawn({
  abi,
  eventName,
  emitter,
  unindexed,
}: SpawnLogArgs): TransactionReceipt {
  const event = getAbiItem({ abi, name: eventName })
  if (event?.type !== 'event') throw new Error(`${eventName} is not an event`)
  return {
    logs: [
      {
        address: emitter,
        topics: encodeEventTopics({ abi, eventName, args: { deployer: DEPLOYER } }),
        data: encodeAbiParameters(
          event.inputs.filter((input) => !input.indexed),
          unindexed,
        ),
      },
    ],
  } as unknown as TransactionReceipt
}

const feeManagerSpawn = (emitter: Address) =>
  receiptWithSpawn({
    abi: feeManagerFactoryAbi,
    eventName: 'SpawnedFeeManager',
    emitter,
    unindexed: [
      DEPLOYED,
      {
        accessControl: zeroAddress,
        initialFees: NO_FEES,
        initialMaxFees: NO_FEES,
        initialRecipients: [],
        deploymentSalt: zeroHash,
      },
    ],
  })

const accountListSpawn = (emitter: Address) =>
  receiptWithSpawn({
    abi: accountListFactoryAbi,
    eventName: 'SpawnedAccountList',
    emitter,
    unindexed: [
      DEPLOYED,
      {
        accessControl: zeroAddress,
        mode: AllowlistMode.STRICT,
        initialAllowList: [DEPLOYER],
        initialBlockList: [],
        sanctionsEnabled: false,
        oracle: zeroAddress,
        deploymentSalt: zeroHash,
      },
    ],
  })

const ownerRegistrySpawn = (emitter: Address) =>
  receiptWithSpawn({
    abi: ownerRegistryFactoryAbi,
    eventName: 'SpawnedOwnerRegistry',
    emitter,
    unindexed: [DEPLOYED, { symbol: 'RRQ', name: 'Railnet Requests', deploymentSalt: zeroHash }],
  })

describe('module addresses from a spawn receipt', () => {
  it('reads the fee manager the factory deployed', () => {
    expect(extractFeeManagerAddress(feeManagerSpawn(FACTORY), FACTORY)).toBe(DEPLOYED)
  })

  it('reads the account list the factory deployed', () => {
    expect(extractAccountListAddress(accountListSpawn(FACTORY), FACTORY)).toBe(DEPLOYED)
  })

  it('reads the owner registry the factory deployed', () => {
    expect(extractOwnerRegistryAddress(ownerRegistrySpawn(FACTORY), FACTORY)).toBe(DEPLOYED)
  })

  it('ignores the same event emitted by another contract, so a forged log cannot name the module', () => {
    expect(extractFeeManagerAddress(feeManagerSpawn(OTHER_CONTRACT), FACTORY)).toBeNull()
    expect(extractAccountListAddress(accountListSpawn(OTHER_CONTRACT), FACTORY)).toBeNull()
    expect(extractOwnerRegistryAddress(ownerRegistrySpawn(OTHER_CONTRACT), FACTORY)).toBeNull()
  })
})
