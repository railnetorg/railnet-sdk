import { describe, expect, test } from 'bun:test'
import { encodeAbiParameters, keccak256, zeroAddress, zeroHash } from 'viem'
import {
  externalAccessControlAbi,
  type PreparedWrite,
  prepareDepositConduit,
  prepareGrantScopedRole,
  prepareRedeemConduit,
  prepareSpawnConduit,
} from '../src/index.js'

const account = '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const

describe('prepare* writes', () => {
  test('prepareGrantScopedRole returns { address, abi, functionName, args }', () => {
    const prepared: PreparedWrite = prepareGrantScopedRole({
      accessControl: zeroAddress,
      role: zeroHash,
      scope: zeroAddress,
      grantee: zeroAddress,
    })
    expect(prepared.address).toBe(zeroAddress)
    expect(prepared.abi).toBe(externalAccessControlAbi)
    expect(prepared.functionName).toBe('grantScopedRole')
    expect(prepared.args).toEqual([zeroHash, zeroAddress, zeroAddress])
  })

  test('prepareDepositConduit emits the conduit.create call (no approve)', () => {
    const prepared = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('create')
    expect(prepared.args).toHaveLength(3)
    expect(prepared.args[1]).toBe(account)
    expect(prepared.args[2]).toBe(zeroHash)
  })

  test('prepareDepositConduit binds query.salt to (account, sourceSalt)', () => {
    const prepared = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      salt: zeroHash,
    })
    expect(prepared.args[0].salt).toBe(
      keccak256(
        encodeAbiParameters([{ type: 'address' }, { type: 'bytes32' }], [account, zeroHash]),
      ),
    )
  })

  test('prepareRedeemConduit passes sourceSalt raw and defaults receiver to account', () => {
    const prepared = prepareRedeemConduit({
      conduit: zeroAddress,
      shares: 1n,
      account,
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('createRedeemFromConduitShares')
    expect(prepared.args[2]).toBe(zeroHash)
    expect(prepared.args[3]).toBe(account)
  })

  test('prepareSpawnConduit passes deploymentSalt as the second positional arg', () => {
    const prepared = prepareSpawnConduit({
      factory: zeroAddress,
      name: 'X',
      symbol: 'X',
      vehicle: zeroAddress,
      initialExpectedSupply: 1n,
      transferEnabled: true,
      accessControl: zeroAddress,
      feeManager: zeroAddress,
      accountList: zeroAddress,
      ownerRegistry: zeroAddress,
      querySalt: zeroHash,
      deploymentSalt: zeroHash,
    })
    expect(prepared.functionName).toBe('spawn')
    expect(prepared.args[0].transferEnabled).toBe(true)
    expect(prepared.args[1]).toBe(zeroHash)
  })
})
