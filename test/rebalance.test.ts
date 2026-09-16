import { describe, expect, it } from 'bun:test'
import { type Address, decodeFunctionData, maxUint256 } from 'viem'
import {
  buildRebalanceRedeemCall,
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

const inner = (prepared.args[0] as readonly `0x${string}`[]).map((data) =>
  decodeFunctionData({ abi: sectorAccountingEngineAbi, data }),
)

/** Both `move` and `dispatch` take a single struct, so the params are always `args[0]`. */
function paramsOf(index: number): Record<string, unknown> {
  const call = inner[index]
  if (!call) throw new Error(`no inner call at ${index}`)
  return (call.args as readonly unknown[])[0] as Record<string, unknown>
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

  it('redeems the whole staged balance and takes no slippage floor', () => {
    const dispatch = paramsOf(1)

    expect(dispatch.vehicle).toBe(from)
    expect(dispatch.mode).toBe(QueryMode.REDEEM)
    expect(dispatch.amount).toBe(maxUint256)
    expect(dispatch.minOutput).toBe(0n)
  })

  it('threads one operationId through both halves', () => {
    expect(paramsOf(0).operationId).toBe(operationId)
    expect(paramsOf(1).operationId).toBe(operationId)
  })
})
