import { describe, expect, it } from 'bun:test'
import { type Address, decodeFunctionData } from 'viem'
import {
  buildAllocateIdleCall,
  buildRebalanceRedeemCall,
  buildWithdrawToIdleCall,
  QueryMode,
  SECTOR_ALLOCATION,
  SECTOR_AVAILABLE,
  sectorAccountingEngineAbi,
  vehicleSector,
} from '../src/index.js'

const sectorAccountingEngine: Address = '0x1111111111111111111111111111111111111111'
const from: Address = '0x2Ec94b8979868bF5586f8550733092a77Cd77C9E'
const to: Address = '0x5EEfC1d368440B8165e6674f23c1869b07B199A7'
const operationId = `0x${'12'.repeat(32)}` as const

const prepared = buildRebalanceRedeemCall({
  sectorAccountingEngine,
  from,
  to,
  shares: 10n ** 18n,
  operationId,
})

/** Both `move` and `dispatch` take a single struct, so the params are always `args[0]`. */
function innerCalls(multicall: { args: readonly unknown[] }) {
  return (multicall.args[0] as readonly `0x${string}`[]).map((data) => {
    const call = decodeFunctionData({ abi: sectorAccountingEngineAbi, data })
    return {
      functionName: call.functionName,
      params: (call.args as readonly unknown[])[0] as Record<string, unknown>,
    }
  })
}

const inner = innerCalls(prepared)

function paramsOf(index: number): Record<string, unknown> {
  const call = inner[index]
  if (!call) throw new Error(`no inner call at ${index}`)
  return call.params
}

describe('buildRebalanceRedeemCall', () => {
  it('batches the move and the dispatch into one multicall', () => {
    expect(prepared.functionName).toBe('multicall')
    expect(inner.map((call) => call.functionName)).toEqual(['move', 'dispatch'])
  })

  it('moves the source vehicle shares out of ALLOCATION into its own sector', () => {
    const move = paramsOf(0)

    expect(move.from).toBe(SECTOR_ALLOCATION)
    expect(move.to).toBe(vehicleSector(from))
    expect(move.asset).toBe(from)
  })

  /**
   * Settling into AVAILABLE would expose the proceeds to the queue strategy engine before the
   * second transaction lands, so they are parked in the destination's own sector instead.
   */
  it('settles the redeem into the destination sector, never AVAILABLE', () => {
    const dispatch = paramsOf(1)

    expect(dispatch.settledDestination).toBe(vehicleSector(to))
    expect(dispatch.settledDestination).not.toBe(SECTOR_AVAILABLE)
    expect(dispatch.rejectedDestination).toBe(SECTOR_ALLOCATION)
  })

  /**
   * The maxUint256 sentinel resolves to the whole sector balance, so a rebalance abandoned between
   * its two transactions would have its leftovers swept by the next one.
   */
  it('redeems exactly the shares asked for, never the sector balance', () => {
    const dispatch = paramsOf(1)

    expect(dispatch.vehicle).toBe(from)
    expect(dispatch.mode).toBe(QueryMode.REDEEM)
    expect(dispatch.amount).toBe(10n ** 18n)
  })

  it('takes no slippage floor unless one is given', () => {
    expect(paramsOf(1).minOutput).toBe(0n)

    const floored = buildRebalanceRedeemCall({
      sectorAccountingEngine,
      from,
      to,
      shares: 10n ** 18n,
      minOutput: 995n * 10n ** 15n,
      operationId,
    })
    expect(innerCalls(floored)[1]?.params.minOutput).toBe(995n * 10n ** 15n)
  })

  it('threads one operationId through both halves', () => {
    expect(paramsOf(0).operationId).toBe(operationId)
    expect(paramsOf(1).operationId).toBe(operationId)
  })
})

const asset: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

describe('buildWithdrawToIdleCall', () => {
  const withdrawal = buildWithdrawToIdleCall({
    sectorAccountingEngine,
    from,
    shares: 10n ** 18n,
    operationId,
  })
  const [move, redeem] = innerCalls(withdrawal)

  it('batches the move and the redeem into one multicall', () => {
    expect(withdrawal).toMatchObject({ address: sectorAccountingEngine, functionName: 'multicall' })
    expect([move?.functionName, redeem?.functionName]).toEqual(['move', 'dispatch'])
  })

  it('moves the source vehicle shares out of ALLOCATION into its own sector', () => {
    expect(move?.params).toMatchObject({
      from: SECTOR_ALLOCATION,
      to: vehicleSector(from),
      asset: from,
      amount: 10n ** 18n,
    })
  })

  it('settles the redeem into AVAILABLE', () => {
    expect(redeem?.params).toMatchObject({
      vehicle: from,
      mode: QueryMode.REDEEM,
      amount: 10n ** 18n,
      settledDestination: SECTOR_AVAILABLE,
      rejectedDestination: SECTOR_ALLOCATION,
      minOutput: 0n,
    })
  })

  it('carries a slippage floor when one is given', () => {
    const [, floored] = innerCalls(
      buildWithdrawToIdleCall({
        sectorAccountingEngine,
        from,
        shares: 10n ** 18n,
        minOutput: 995n * 10n ** 15n,
        operationId,
      }),
    )

    expect(floored?.params.minOutput).toBe(995n * 10n ** 15n)
  })
})

describe('buildAllocateIdleCall', () => {
  const allocation = buildAllocateIdleCall({
    sectorAccountingEngine,
    to,
    asset,
    amount: 1_000_000n,
    operationId,
  })
  const [move, deposit] = innerCalls(allocation)

  it('batches the move and the deposit into one multicall', () => {
    expect(allocation).toMatchObject({ address: sectorAccountingEngine, functionName: 'multicall' })
  })

  it('moves the base asset out of AVAILABLE into the destination sector', () => {
    expect(move?.functionName).toBe('move')
    expect(move?.params).toMatchObject({
      from: SECTOR_AVAILABLE,
      to: vehicleSector(to),
      asset,
      amount: 1_000_000n,
    })
  })

  it('deposits exactly the amount asked for, never the sector balance', () => {
    expect(deposit?.functionName).toBe('dispatch')
    expect(deposit?.params).toMatchObject({
      vehicle: to,
      mode: QueryMode.DEPOSIT,
      amount: 1_000_000n,
      settledDestination: SECTOR_ALLOCATION,
      rejectedDestination: SECTOR_AVAILABLE,
    })
  })

  it('threads one operationId through both halves', () => {
    expect(move?.params.operationId).toBe(operationId)
    expect(deposit?.params.operationId).toBe(operationId)
  })

  it('carries a slippage floor when one is given', () => {
    const [, floored] = innerCalls(
      buildAllocateIdleCall({
        sectorAccountingEngine,
        to,
        asset,
        amount: 1_000_000n,
        minOutput: 99n * 10n ** 16n,
        operationId,
      }),
    )

    expect(floored?.params.minOutput).toBe(99n * 10n ** 16n)
  })
})
