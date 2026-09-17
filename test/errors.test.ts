import { describe, expect, it } from 'bun:test'
import { BaseError, ContractFunctionRevertedError, encodeErrorResult } from 'viem'
import { baseVehicleAbi } from '../src/abi/baseVehicle.js'
import { conduitAbi } from '../src/abi/conduit.js'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
import { protocolErrorsAbi } from '../src/abi/protocolErrors.js'
import { getRailnetError } from '../src/errors.js'

function revertWith(errorName: string, args: readonly unknown[]) {
  const data = encodeErrorResult({ abi: conduitAbi, errorName, args } as never)

  return new BaseError('simulation failed', {
    cause: new ContractFunctionRevertedError({ abi: conduitAbi, data, functionName: 'create' }),
  })
}

/** A rejection encoded from ErrorLib and reverted through assembly: absent from the call's ABI. */
function revertWithProtocolError(errorName: string, args: readonly unknown[]) {
  const data = encodeErrorResult({ abi: protocolErrorsAbi, errorName, args } as never)

  return new BaseError('simulation failed', {
    cause: new ContractFunctionRevertedError({ abi: conduitAbi, data, functionName: 'create' }),
  })
}

describe('getRailnetError', () => {
  it('decodes a custom error out of the chain viem throws', () => {
    const railnetError = getRailnetError(revertWith('QueryAlreadyExists', [`0x${'11'.repeat(32)}`]))

    expect(railnetError?.name).toBe('QueryAlreadyExists')
    expect(railnetError?.args).toEqual([`0x${'11'.repeat(32)}`])
    expect(railnetError?.hint).toContain('randomSalt')
  })

  it('leaves hint undefined for an error it carries no advice on', () => {
    const railnetError = getRailnetError(revertWith('ReentrancyGuardReentrantCall', []))

    expect(railnetError?.name).toBe('ReentrancyGuardReentrantCall')
    expect(railnetError?.hint).toBeUndefined()
  })

  it('falls back to the protocol errors for a revert the call ABI cannot decode', () => {
    const queryOutput = { asset: `0x${'22'.repeat(20)}`, value: 0n }
    const thrown = revertWithProtocolError('InvalidOutput', [queryOutput])

    expect((thrown.cause as ContractFunctionRevertedError).data).toBeUndefined()

    const railnetError = getRailnetError(thrown)
    expect(railnetError?.name).toBe('InvalidOutput')
    expect(railnetError?.args).toEqual([queryOutput])
    expect(railnetError?.hint).toContain('must name the vehicle itself')
  })

  it('decodes the minOutput floor rejection', () => {
    const railnetError = getRailnetError(
      revertWithProtocolError('InvalidEstimation', [
        { asset: `0x${'33'.repeat(20)}`, value: 100n },
        { asset: `0x${'33'.repeat(20)}`, value: 90n },
      ]),
    )

    expect(railnetError?.name).toBe('InvalidEstimation')
    expect(railnetError?.hint).toContain('output floor')
  })

  /** `railnetErrorHints` is a bare object literal, so it inherits `toString` from the prototype. */
  it('reads no hint off the prototype chain', () => {
    const inheritedName = [{ type: 'error', name: 'toString', inputs: [] }] as const
    const railnetError = getRailnetError(
      new BaseError('simulation failed', {
        cause: new ContractFunctionRevertedError({
          abi: inheritedName,
          data: encodeErrorResult({ abi: inheritedName, errorName: 'toString' }),
          functionName: 'create',
        }),
      }),
    )

    expect(railnetError?.name).toBe('toString')
    expect(railnetError?.hint).toBeUndefined()
  })

  it('returns null for a failure that is not a contract revert', () => {
    expect(getRailnetError(new Error('user rejected the request'))).toBeNull()
    expect(getRailnetError(new BaseError('http request failed'))).toBeNull()
    expect(getRailnetError(undefined)).toBeNull()
  })
})

/** A revert raised by another contract inside a factory spawn: absent from the factory's own ABI. */
function revertDuringSpawn(errorName: string, args: readonly unknown[]) {
  const data = encodeErrorResult({ abi: protocolErrorsAbi, errorName, args } as never)

  return new BaseError('simulation failed', {
    cause: new ContractFunctionRevertedError({
      abi: conduitFactoryAbi,
      data,
      functionName: 'spawn',
    }),
  })
}

describe('cross-contract reverts', () => {
  const asset = `0x${'44'.repeat(20)}` as const

  it.each([
    ['AssetNotAuthorized', [asset]],
    ['InvalidInitialExpectedSupply', []],
    ['InvalidInitialDepositSize', []],
    ['EnforcedPause', []],
    ['ReservePaused', []],
    ['ReserveFrozen', []],
    ['ReserveNotActive', []],
    ['MarketDecimalsMismatch', [6, 18]],
    ['FailedContractCreation', [asset]],
  ])('decodes %s raised during a spawn', (errorName, args) => {
    const thrown = revertDuringSpawn(errorName, args)

    expect((thrown.cause as ContractFunctionRevertedError).data).toBeUndefined()
    expect(getRailnetError(thrown)?.name).toBe(errorName)
  })

  it('decodes the two reverts BaseVehicle.estimate can raise', () => {
    for (const [errorName, args] of [
      ['ZeroInputValue', []],
      ['InvalidInput', [{ asset, value: 0n }]],
    ] as const) {
      const data = encodeErrorResult({ abi: protocolErrorsAbi, errorName, args } as never)
      const thrown = new BaseError('read failed', {
        cause: new ContractFunctionRevertedError({
          abi: baseVehicleAbi,
          data,
          functionName: 'estimate',
        }),
      })

      expect(getRailnetError(thrown)?.name).toBe(errorName)
    }
  })
})
