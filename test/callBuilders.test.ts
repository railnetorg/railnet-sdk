import { describe, expect, test } from 'bun:test'
import type { Address } from 'viem'
import {
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  maxUint256,
  toFunctionSelector,
  toHex,
  zeroAddress,
  zeroHash,
} from 'viem'
import {
  AllowlistMode,
  accountListAbi,
  accountListFactoryAbi,
  buildAcceptDefaultAdminTransferCall,
  buildAddToAllowListCall,
  buildAddToBlockListCall,
  buildBeginDefaultAdminTransferCall,
  buildCancelDefaultAdminTransferCall,
  buildDepositConduitCall,
  buildDispatchFeesCall,
  buildDispatchVehicleCall,
  buildFeedQueryRedeemQueueCall,
  buildForceRedeemCall,
  buildGrantRoleCall,
  buildGrantScopedRoleCall,
  buildMoveBetweenSectorsCall,
  buildRedeemConduitCall,
  buildRenounceRoleCall,
  buildRetrieveQueryRedeemQueueAssetsCall,
  buildRevokeRoleCall,
  buildSetFeeRecipientsCall,
  buildSetFeesCall,
  buildSetRolePublicCall,
  buildSpawnAaveV3VehicleCall,
  buildSpawnAccessControlCall,
  buildSpawnAccountListCall,
  buildSpawnConduitCall,
  buildSpawnFeeManagerCall,
  buildSpawnMultiVehicleCall,
  buildSpawnOwnerRegistryCall,
  externalAccessControlAbi,
  feeManagerAbi,
  feeManagerFactoryAbi,
  QueryMode,
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

  test('buildForceRedeemCall pays the ejected holder, not the caller', () => {
    const user = '0x1111111111111111111111111111111111111111' as const
    const prepared = buildForceRedeemCall({
      conduit: zeroAddress,
      user,
      amount: 100n,
      outputAsset: { asset: USDC_ASSET, value: 0n },
    })

    expect(prepared.functionName).toBe('forceRedeem')
    expect(prepared.args).toEqual([user, 100n, { asset: USDC_ASSET, value: 0n }])
    // The conduit derives both the burn source and the payout target from `user`; the caller's
    // address never enters the calldata.
    expect(encodeFunctionData(prepared).toLowerCase()).not.toContain(sender.slice(2).toLowerCase())
  })

  test('the global role builders hit the unscoped entrypoints', () => {
    const role = keccak256(toHex('FACTORY_SPAWN'))
    const account = '0x2222222222222222222222222222222222222222' as const

    expect(buildGrantRoleCall({ accessControl: zeroAddress, role, account })).toMatchObject({
      functionName: 'grantRole',
      args: [role, account],
    })
    expect(buildRevokeRoleCall({ accessControl: zeroAddress, role, account })).toMatchObject({
      functionName: 'revokeRole',
      args: [role, account],
    })
    expect(
      buildRenounceRoleCall({ accessControl: zeroAddress, role, callerConfirmation: account }),
    ).toMatchObject({ functionName: 'renounceRole', args: [role, account] })
    expect(
      buildSetRolePublicCall({ accessControl: zeroAddress, role, isPublic: true }),
    ).toMatchObject({ functionName: 'setRolePublic', args: [role, true] })
  })

  test('a global grant and a scoped grant are different calls', () => {
    const role = keccak256(toHex('FACTORY_SPAWN'))
    const account = '0x2222222222222222222222222222222222222222' as const

    const global = buildGrantRoleCall({ accessControl: zeroAddress, role, account })
    const scoped = buildGrantScopedRoleCall({
      accessControl: zeroAddress,
      role,
      scope: VEHICLE,
      grantee: account,
    })

    expect(encodeFunctionData(global)).not.toBe(encodeFunctionData(scoped as never))
    expect(encodeFunctionData(global).slice(0, 10)).toBe(
      toFunctionSelector('grantRole(bytes32,address)'),
    )
  })

  test('the redeem queue calls hit the vehicle manager', () => {
    const vehicleManager = '0x4444444444444444444444444444444444444444' as const

    const feed = buildFeedQueryRedeemQueueCall({ vehicleManager })
    expect(feed.address).toBe(vehicleManager)
    expect(feed.functionName).toBe('feedQueryRedeemQueue')
    expect(feed.args).toEqual([])

    const retrieve = buildRetrieveQueryRedeemQueueAssetsCall({ vehicleManager, amount: 1_000n })
    expect(retrieve.functionName).toBe('retrieveQueryRedeemQueueAssets')
    expect(retrieve.args).toEqual([1_000n])
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
      mode: QueryMode.REDEEM,
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
        mode: QueryMode.REDEEM,
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

  test('buildSpawnFeeManagerCall wraps the params the factory expects', () => {
    const fees = {
      performanceFeeBps: 1000,
      managementFeeBps: 50,
      depositFeeBps: 0,
      redeemFeeBps: 0,
    }
    const maxFees = {
      performanceFeeBps: 2000,
      managementFeeBps: 200,
      depositFeeBps: 100,
      redeemFeeBps: 100,
    }
    const recipients = [{ target: USDC_ASSET, shareBps: 10000 }] as const

    const prepared = buildSpawnFeeManagerCall({
      factory: VEHICLE,
      accessControl: zeroAddress,
      initialFees: fees,
      initialMaxFees: maxFees,
      initialRecipients: recipients,
      deploymentSalt: zeroHash,
    })

    expect(prepared.address).toBe(VEHICLE)
    expect(prepared.abi).toBe(feeManagerFactoryAbi)
    expect(prepared.functionName).toBe('spawn')
    expect(prepared.args).toEqual([
      {
        accessControl: zeroAddress,
        initialFees: fees,
        initialMaxFees: maxFees,
        initialRecipients: recipients,
        deploymentSalt: zeroHash,
      },
    ])
    expect(() =>
      encodeFunctionData({ abi: feeManagerFactoryAbi, functionName: 'spawn', args: prepared.args }),
    ).not.toThrow()
  })

  test('buildSetFeesCall and buildSetFeeRecipientsCall target the fee manager itself', () => {
    const fees = {
      performanceFeeBps: 1000,
      managementFeeBps: 50,
      depositFeeBps: 0,
      redeemFeeBps: 0,
    }
    const setFees = buildSetFeesCall({ feeManager: VEHICLE, fees })
    expect(setFees.address).toBe(VEHICLE)
    expect(setFees.abi).toBe(feeManagerAbi)
    expect(setFees.functionName).toBe('setFees')
    expect(setFees.args).toEqual([fees])

    // FeeManager._setRecipients requires strictly ascending targets summing to 10000 bps.
    const recipients = [
      { target: '0x0000000000000000000000000000000000000001', shareBps: 4000 },
      { target: '0x0000000000000000000000000000000000000002', shareBps: 6000 },
    ] as const
    const setRecipients = buildSetFeeRecipientsCall({ feeManager: VEHICLE, recipients })
    expect(setRecipients.functionName).toBe('setFeeRecipients')
    expect(() =>
      encodeFunctionData({
        abi: feeManagerAbi,
        functionName: 'setFeeRecipients',
        args: setRecipients.args,
      }),
    ).not.toThrow()
  })

  test('buildDispatchFeesCall pays one token out to the recipients', () => {
    const prepared = buildDispatchFeesCall({ feeManager: VEHICLE, token: USDC_ASSET })
    expect(prepared.functionName).toBe('dispatchERC20')
    expect(prepared.args).toEqual([USDC_ASSET])
  })

  test('buildSpawnAccountListCall seeds both lists and the sanctions config', () => {
    const prepared = buildSpawnAccountListCall({
      factory: VEHICLE,
      accessControl: zeroAddress,
      mode: AllowlistMode.STRICT,
      initialAllowList: [USDC_ASSET],
      initialBlockList: [],
      sanctionsEnabled: false,
      oracle: zeroAddress,
      deploymentSalt: zeroHash,
    })

    expect(prepared.address).toBe(VEHICLE)
    expect(prepared.abi).toBe(accountListFactoryAbi)
    expect(prepared.functionName).toBe('spawn')
    expect(prepared.args).toEqual([
      {
        accessControl: zeroAddress,
        mode: AllowlistMode.STRICT,
        initialAllowList: [USDC_ASSET],
        initialBlockList: [],
        sanctionsEnabled: false,
        oracle: zeroAddress,
        deploymentSalt: zeroHash,
      },
    ])
    expect(() =>
      encodeFunctionData({
        abi: accountListFactoryAbi,
        functionName: 'spawn',
        args: prepared.args,
      }),
    ).not.toThrow()
  })

  test('the allow and block list calls take a batch and target the list itself', () => {
    const accounts = [USDC_ASSET] as const
    const allow = buildAddToAllowListCall({ accountList: VEHICLE, accounts })
    const block = buildAddToBlockListCall({ accountList: VEHICLE, accounts })

    expect(allow.address).toBe(VEHICLE)
    expect(allow.abi).toBe(accountListAbi)
    expect(allow.functionName).toBe('addToAllowList')
    expect(allow.args).toEqual([accounts])
    expect(block.functionName).toBe('addToBlockList')
  })

  test('buildSpawnOwnerRegistryCall passes symbol before name, as the struct declares them', () => {
    const prepared = buildSpawnOwnerRegistryCall({
      factory: VEHICLE,
      name: 'Railnet Query Claims',
      symbol: 'RQC',
      deploymentSalt: zeroHash,
    })

    expect(prepared.args).toEqual([
      { symbol: 'RQC', name: 'Railnet Query Claims', deploymentSalt: zeroHash },
    ])
  })
})

describe('the default admin handover builders', () => {
  const accessControl = '0x3333333333333333333333333333333333333333' as const
  const newAdmin = '0x4444444444444444444444444444444444444444' as const

  test('begin names the incoming admin, accept and cancel take no argument', () => {
    expect(buildBeginDefaultAdminTransferCall({ accessControl, newAdmin })).toMatchObject({
      address: accessControl,
      functionName: 'beginDefaultAdminTransfer',
      args: [newAdmin],
    })
    expect(buildAcceptDefaultAdminTransferCall({ accessControl })).toMatchObject({
      functionName: 'acceptDefaultAdminTransfer',
      args: [],
    })
    expect(buildCancelDefaultAdminTransferCall({ accessControl })).toMatchObject({
      functionName: 'cancelDefaultAdminTransfer',
      args: [],
    })
  })
})
