import { describe, expect, it } from 'bun:test'
import { zeroAddress, zeroHash } from 'viem'
import {
  AllowlistMode,
  buildAddToAllowListCall,
  buildAddToBlockListCall,
  buildSetFeeRecipientsCall,
  buildSetFeesCall,
  buildSpawnAccountListCall,
  buildSpawnFeeManagerCall,
} from '../src/index.js'

const LOW = '0x1111111111111111111111111111111111111111' as const
const HIGH = '0xEEeeEeEEeEEEeeEEEeEeeEEEeeEeeeeeeEEeEEeE' as const
const feeManager = zeroAddress
const accountList = zeroAddress

const validFees = {
  performanceFeeBps: 1000,
  managementFeeBps: 50,
  depositFeeBps: 0,
  redeemFeeBps: 0,
}

describe('buildSetFeeRecipientsCall', () => {
  it('accepts a split that is ascending and totals 10000', () => {
    const call = buildSetFeeRecipientsCall({
      feeManager,
      recipients: [
        { target: LOW, shareBps: 4000 },
        { target: HIGH, shareBps: 6000 },
      ],
    })

    expect(call.functionName).toBe('setFeeRecipients')
  })

  it('rejects a split that does not total 10000', () => {
    expect(() =>
      buildSetFeeRecipientsCall({ feeManager, recipients: [{ target: LOW, shareBps: 9999 }] }),
    ).toThrow('must total 10000 bps, got 9999')
  })

  it('rejects a split that is not strictly ascending', () => {
    expect(() =>
      buildSetFeeRecipientsCall({
        feeManager,
        recipients: [
          { target: HIGH, shareBps: 6000 },
          { target: LOW, shareBps: 4000 },
        ],
      }),
    ).toThrow('sorted strictly ascending')
  })

  // A checksummed address sorts by case, so the comparison has to lowercase first.
  it('orders on the address, not on its checksum casing', () => {
    const call = buildSetFeeRecipientsCall({
      feeManager,
      recipients: [
        { target: LOW.toLowerCase() as typeof LOW, shareBps: 4000 },
        { target: HIGH, shareBps: 6000 },
      ],
    })

    expect(call.args[0]).toHaveLength(2)
  })

  it('rejects a duplicate target', () => {
    expect(() =>
      buildSetFeeRecipientsCall({
        feeManager,
        recipients: [
          { target: LOW, shareBps: 5000 },
          { target: LOW, shareBps: 5000 },
        ],
      }),
    ).toThrow('sorted strictly ascending')
  })

  it('rejects an empty split', () => {
    expect(() => buildSetFeeRecipientsCall({ feeManager, recipients: [] })).toThrow(
      'must not be empty',
    )
  })

  it('rejects a zero share', () => {
    expect(() =>
      buildSetFeeRecipientsCall({
        feeManager,
        recipients: [
          { target: LOW, shareBps: 0 },
          { target: HIGH, shareBps: 10000 },
        ],
      }),
    ).toThrow('positive integer')
  })
})

describe('buildSetFeesCall', () => {
  it('accepts rates inside [0, 10000]', () => {
    expect(buildSetFeesCall({ feeManager, fees: validFees }).functionName).toBe('setFees')
  })

  it('rejects a rate above 10000', () => {
    expect(() =>
      buildSetFeesCall({ feeManager, fees: { ...validFees, performanceFeeBps: 10_001 } }),
    ).toThrow('performanceFeeBps must be an integer between 0 and 10000')
  })

  // A 100% transactional fee is not reversible, so the FeeManager caps deposit and redeem at 9999.
  it('rejects a 100% deposit fee while allowing a 100% performance fee', () => {
    expect(() =>
      buildSetFeesCall({ feeManager, fees: { ...validFees, depositFeeBps: 10_000 } }),
    ).toThrow('depositFeeBps must be an integer between 0 and 9999')

    expect(
      buildSetFeesCall({ feeManager, fees: { ...validFees, performanceFeeBps: 10_000 } })
        .functionName,
    ).toBe('setFees')
  })

  it('rejects a negative rate', () => {
    expect(() =>
      buildSetFeesCall({ feeManager, fees: { ...validFees, redeemFeeBps: -1 } }),
    ).toThrow('redeemFeeBps')
  })
})

describe('buildSpawnFeeManagerCall', () => {
  const spawn = {
    factory: zeroAddress,
    accessControl: zeroAddress,
    initialFees: validFees,
    initialMaxFees: validFees,
    initialRecipients: [{ target: LOW, shareBps: 10_000 }],
    deploymentSalt: zeroHash,
  } as const

  it('accepts rates at their ceiling', () => {
    expect(buildSpawnFeeManagerCall(spawn).functionName).toBe('spawn')
  })

  it('validates the initial split', () => {
    expect(() =>
      buildSpawnFeeManagerCall({
        ...spawn,
        initialRecipients: [{ target: LOW, shareBps: 5000 }],
      }),
    ).toThrow('must total 10000 bps')
  })

  // __FeeManager_init applies initialMaxFees and then runs initialFees through the same _checkFee,
  // so a rate above its own ceiling reverts FeeTooHigh at spawn.
  it('rejects an initial rate above its own ceiling', () => {
    expect(() =>
      buildSpawnFeeManagerCall({
        ...spawn,
        initialFees: { ...validFees, performanceFeeBps: 2000 },
        initialMaxFees: { ...validFees, performanceFeeBps: 1000 },
      }),
    ).toThrow('performanceFeeBps is 2000, above its ceiling of 1000')
  })
})

describe('buildSpawnAccountListCall', () => {
  const base = {
    factory: zeroAddress,
    accessControl: zeroAddress,
    mode: AllowlistMode.OPEN,
    initialAllowList: [],
    initialBlockList: [],
    deploymentSalt: zeroHash,
  } as const

  it('rejects screening enabled without an oracle', () => {
    expect(() =>
      buildSpawnAccountListCall({ ...base, sanctionsEnabled: true, oracle: zeroAddress }),
    ).toThrow('SanctionsOracleRequired')
  })

  it('allows a zero oracle while screening is off', () => {
    expect(
      buildSpawnAccountListCall({ ...base, sanctionsEnabled: false, oracle: zeroAddress })
        .functionName,
    ).toBe('spawn')
  })
})

describe('account list batches', () => {
  it('rejects a repeated account', () => {
    expect(() => buildAddToAllowListCall({ accountList, accounts: [LOW, LOW] })).toThrow(
      'appears twice',
    )
  })

  it('rejects the zero address', () => {
    expect(() => buildAddToBlockListCall({ accountList, accounts: [zeroAddress] })).toThrow(
      'zero address',
    )
  })

  it('rejects an empty batch', () => {
    expect(() => buildAddToAllowListCall({ accountList, accounts: [] })).toThrow(
      'must not be empty',
    )
  })
})
