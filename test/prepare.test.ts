import { describe, expect, test } from 'bun:test'
import {
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  maxUint256,
  toFunctionSelector,
  zeroAddress,
  zeroHash,
} from 'viem'
import {
  ConduitMode,
  externalAccessControlAbi,
  type PreparedWrite,
  prepareDepositConduit,
  prepareDispatchVehicle,
  prepareGrantScopedRole,
  prepareMoveBetweenSectors,
  prepareRedeemConduit,
  prepareSpawnConduit,
  SECTOR_AVAILABLE,
  SECTOR_RESERVED,
  vehicleSector,
} from '../src/index.js'

const account = '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const
const VEHICLE = '0x5EEfC1d368440B8165e6674f23c1869b07B199A7' as const
const USDC_ASSET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

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
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('create')
    expect(prepared.args).toHaveLength(3)
    expect(prepared.args[1]).toBe(account)
    expect(prepared.args[2]).toBe(zeroHash)
  })

  test('prepareDepositConduit names the vehicle as the query output asset', () => {
    const prepared = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(prepared.args[0].output).toEqual({ asset: VEHICLE, value: 0n })
  })

  test('prepareDepositConduit binds query.salt to (account, sourceSalt)', () => {
    const prepared = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      vehicle: VEHICLE,
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
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('createRedeemFromConduitShares')
    expect(prepared.args[2]).toBe(zeroHash)
    expect(prepared.args[3]).toBe(account)
  })

  test('prepareDepositConduit builds scalar Asset legs, not single-element arrays', () => {
    const prepared = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(Array.isArray(prepared.args[0].input)).toBe(false)
    expect(Array.isArray(prepared.args[0].output)).toBe(false)
    expect(prepared.args[0].input).toEqual({ asset: zeroAddress, value: 100n })
  })

  test('prepareRedeemConduit passes the output asset through as a scalar', () => {
    const prepared = prepareRedeemConduit({
      conduit: zeroAddress,
      shares: 1n,
      account,
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(Array.isArray(prepared.args[1])).toBe(false)
    expect(prepared.args[1]).toEqual({ asset: USDC_ASSET, value: 0n })
  })

  // STEAM scalarized `Asset[]` to `Asset` (contracts b4534821). An array-shaped Asset changes the tuple
  // encoding and therefore the selector, so the call would silently miss the deployed function.
  test('prepared conduit writes encode to the deployed scalar-Asset selectors', () => {
    const query = '(address,address,(address,uint256),(address,uint256),uint8,bytes32,bytes)'

    const deposit = prepareDepositConduit({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      account,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(encodeFunctionData(deposit).slice(0, 10)).toBe(
      toFunctionSelector(`create(${query},address,bytes32)`),
    )

    const redeem = prepareRedeemConduit({
      conduit: zeroAddress,
      shares: 1n,
      account,
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(encodeFunctionData(redeem).slice(0, 10)).toBe(
      toFunctionSelector(
        'createRedeemFromConduitShares(uint256,(address,uint256),bytes32,address)',
      ),
    )
  })

  test('prepareSpawnConduit sends a single struct arg carrying both salts', () => {
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
    expect(prepared.args).toHaveLength(1)
    expect(prepared.args[0].transferEnabled).toBe(true)
    expect(prepared.args[0].querySalt).toBe(zeroHash)
    expect(prepared.args[0].deploymentSalt).toBe(zeroHash)
  })

  test('prepareMoveBetweenSectors wraps the params in a single struct arg', () => {
    const prepared = prepareMoveBetweenSectors({
      sectorAccountingEngine: zeroAddress,
      from: SECTOR_AVAILABLE,
      to: SECTOR_RESERVED,
      asset: zeroAddress,
      amount: 100n,
      operationId: zeroHash,
    })
    expect(prepared.functionName).toBe('move')
    expect(prepared.args).toHaveLength(1)
    expect(prepared.args[0].from).toBe(SECTOR_AVAILABLE)
    expect(prepared.args[0].to).toBe(SECTOR_RESERVED)
  })

  test('prepareDispatchVehicle defaults minOutput and data', () => {
    const prepared = prepareDispatchVehicle({
      sectorAccountingEngine: zeroAddress,
      vehicle: zeroAddress,
      mode: ConduitMode.REDEEM,
      amount: 100n,
      settledDestination: SECTOR_AVAILABLE,
      rejectedDestination: vehicleSector(zeroAddress),
      operationId: zeroHash,
    })
    expect(prepared.functionName).toBe('dispatch')
    expect(prepared.args[0].minOutput).toBe(0n)
    expect(prepared.args[0].data).toBe('0x')
  })

  test('prepareDispatchVehicle rejects a slippage bound on a full-sector dispatch', () => {
    expect(() =>
      prepareDispatchVehicle({
        sectorAccountingEngine: zeroAddress,
        vehicle: zeroAddress,
        mode: ConduitMode.REDEEM,
        amount: maxUint256,
        minOutput: 1n,
        settledDestination: SECTOR_AVAILABLE,
        rejectedDestination: vehicleSector(zeroAddress),
        operationId: zeroHash,
      }),
    ).toThrow(/minOutput requires a pinned amount/)
  })
})
