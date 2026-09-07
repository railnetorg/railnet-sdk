import { describe, expect, test } from 'bun:test'
import type { Address } from 'viem'
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
  buildDepositConduitCall,
  buildDispatchVehicleCall,
  buildGrantScopedRoleCall,
  buildMoveBetweenSectorsCall,
  buildRedeemConduitCall,
  buildSpawnAaveV3VehicleCall,
  buildSpawnAccessControlCall,
  buildSpawnConduitCall,
  buildSpawnMultiVehicleCall,
  ConduitMode,
  externalAccessControlAbi,
  randomSalt,
  SECTOR_AVAILABLE,
  SECTOR_RESERVED,
  vehicleSector,
} from '../src/index.js'

const sender = '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const
const VEHICLE = '0x5EEfC1d368440B8165e6674f23c1869b07B199A7' as const
const USDC_ASSET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

type BuiltCall = {
  address: Address
  abi: unknown
  functionName: string
  args: readonly unknown[]
}

describe('build*Call builders', () => {
  test('buildGrantScopedRoleCall returns { address, abi, functionName, args }', () => {
    const prepared: BuiltCall = buildGrantScopedRoleCall({
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

  test('buildDepositConduitCall emits the conduit.create call (no approve)', () => {
    const prepared = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('create')
    expect(prepared.args).toHaveLength(3)
    expect(prepared.args[1]).toBe(sender)
    expect(prepared.args[2]).toBe(zeroHash)
  })

  test('buildDepositConduitCall names the vehicle as the query output asset', () => {
    const prepared = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(prepared.args[0].output).toEqual({ asset: VEHICLE, value: 0n })
  })

  test('buildDepositConduitCall carries a slippage floor into the query output', () => {
    const prepared = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      minOutput: 99n,
      salt: zeroHash,
    })
    // BaseVehicle._validateConstraints rejects when output.value > the create-time estimate.
    expect(prepared.args[0].output).toEqual({ asset: VEHICLE, value: 99n })
  })

  test('buildDepositConduitCall binds query.salt to (sender, sourceSalt)', () => {
    const prepared = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(prepared.args[0].salt).toBe(
      keccak256(
        encodeAbiParameters([{ type: 'address' }, { type: 'bytes32' }], [sender, zeroHash]),
      ),
    )
  })

  test('buildRedeemConduitCall passes sourceSalt raw and defaults receiver to sender', () => {
    const prepared = buildRedeemConduitCall({
      conduit: zeroAddress,
      shares: 1n,
      sender,
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(prepared.functionName).toBe('createRedeemFromConduitShares')
    expect(prepared.args[2]).toBe(zeroHash)
    expect(prepared.args[3]).toBe(sender)
  })

  test('buildDepositConduitCall builds scalar Asset legs, not single-element arrays', () => {
    const prepared = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(Array.isArray(prepared.args[0].input)).toBe(false)
    expect(Array.isArray(prepared.args[0].output)).toBe(false)
    expect(prepared.args[0].input).toEqual({ asset: zeroAddress, value: 100n })
  })

  test('buildRedeemConduitCall passes the output asset through as a scalar', () => {
    const prepared = buildRedeemConduitCall({
      conduit: zeroAddress,
      shares: 1n,
      sender,
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(Array.isArray(prepared.args[1])).toBe(false)
    expect(prepared.args[1]).toEqual({ asset: USDC_ASSET, value: 0n })
  })

  // STEAM scalarized `Asset[]` to `Asset`. An array-shaped Asset changes the tuple
  // encoding and therefore the selector, so the call would silently miss the deployed function.
  test('prepared conduit writes encode to the deployed scalar-Asset selectors', () => {
    const query = '(address,address,(address,uint256),(address,uint256),uint8,bytes32,bytes)'

    const deposit = buildDepositConduitCall({
      conduit: zeroAddress,
      token: zeroAddress,
      amount: 100n,
      sender,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    expect(encodeFunctionData(deposit).slice(0, 10)).toBe(
      toFunctionSelector(`create(${query},address,bytes32)`),
    )

    const redeem = buildRedeemConduitCall({
      conduit: zeroAddress,
      shares: 1n,
      sender,
      outputAsset: { asset: USDC_ASSET, value: 0n },
      salt: zeroHash,
    })
    expect(encodeFunctionData(redeem).slice(0, 10)).toBe(
      toFunctionSelector(
        'createRedeemFromConduitShares(uint256,(address,uint256),bytes32,address)',
      ),
    )
  })

  test('buildSpawnConduitCall sends a single struct arg carrying both salts', () => {
    const prepared = buildSpawnConduitCall({
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

  test('buildMoveBetweenSectorsCall wraps the params in a single struct arg', () => {
    const prepared = buildMoveBetweenSectorsCall({
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

  test('buildDispatchVehicleCall defaults minOutput and data', () => {
    const prepared = buildDispatchVehicleCall({
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

  test('buildDispatchVehicleCall rejects a slippage bound on a full-sector dispatch', () => {
    expect(() =>
      buildDispatchVehicleCall({
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

describe('build*Call builders are pure', () => {
  const mvSalts = {
    multiVehicle: zeroHash,
    queryRedeemQueue: zeroHash,
    queueStrategyEngine: zeroHash,
    sectorAccountingEngine: zeroHash,
    subQueryEngine: zeroHash,
    vehicleManager: zeroHash,
    initialDepositQuery: zeroHash,
  }

  const builders: Array<[string, () => BuiltCall]> = [
    [
      'buildDepositConduitCall',
      () =>
        buildDepositConduitCall({
          conduit: zeroAddress,
          token: USDC_ASSET,
          amount: 100n,
          sender,
          vehicle: VEHICLE,
          salt: zeroHash,
        }),
    ],
    [
      'buildRedeemConduitCall',
      () =>
        buildRedeemConduitCall({
          conduit: zeroAddress,
          shares: 100n,
          sender,
          outputAsset: { asset: USDC_ASSET, value: 0n },
          salt: zeroHash,
        }),
    ],
    [
      'buildSpawnConduitCall',
      () =>
        buildSpawnConduitCall({
          factory: zeroAddress,
          name: 'Conduit',
          symbol: 'CDT',
          vehicle: VEHICLE,
          initialExpectedSupply: 1n,
          transferEnabled: true,
          accessControl: zeroAddress,
          feeManager: zeroAddress,
          accountList: zeroAddress,
          ownerRegistry: zeroAddress,
          querySalt: zeroHash,
          deploymentSalt: zeroHash,
        }),
    ],
    [
      'buildSpawnMultiVehicleCall',
      () =>
        buildSpawnMultiVehicleCall({
          factory: zeroAddress,
          asset: USDC_ASSET,
          name: 'Multi',
          symbol: 'MV',
          accessControl: zeroAddress,
          queryRegistry: zeroAddress,
          salts: mvSalts,
        }),
    ],
    [
      'buildSpawnAaveV3VehicleCall',
      () =>
        buildSpawnAaveV3VehicleCall({
          factory: zeroAddress,
          asset: USDC_ASSET,
          poolAddressesProvider: zeroAddress,
          accessControl: zeroAddress,
          queryRegistry: zeroAddress,
          initialExpectedSupply: 1n,
          querySalt: zeroHash,
          deploymentSalt: zeroHash,
        }),
    ],
    [
      'buildSpawnAccessControlCall',
      () =>
        buildSpawnAccessControlCall({
          factory: zeroAddress,
          initialDefaultAdmin: sender,
          deploymentSalt: zeroHash,
        }),
    ],
  ]

  test.each(builders)('%s encodes identical calldata twice', (_name, build) => {
    const first = build()
    const second = build()

    expect(encodeFunctionData(first as never)).toBe(encodeFunctionData(second as never))
  })
})

describe('randomSalt', () => {
  test('returns a distinct bytes32 each call', () => {
    const salts = new Set(Array.from({ length: 64 }, () => randomSalt()))

    expect(salts.size).toBe(64)
    for (const salt of salts) {
      expect(salt).toMatch(/^0x[0-9a-f]{64}$/)
    }
  })
})
