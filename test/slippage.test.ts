import { describe, expect, it } from 'bun:test'
import { applySlippage } from '../src/index.js'

describe('applySlippage', () => {
  it('lowers an estimate by the given basis points', () => {
    expect(applySlippage(1_000_000n, 50)).toBe(995_000n)
    expect(applySlippage(1_000_000n, 0)).toBe(1_000_000n)
  })

  it('floors rather than rounds, so the bound is never raised above what was asked', () => {
    expect(applySlippage(9_999n, 50)).toBe(9_949n)
  })

  it('leaves a zero estimate at zero, which sets no floor at all', () => {
    expect(applySlippage(0n, 50)).toBe(0n)
  })

  it('rejects basis points that cannot describe a floor', () => {
    expect(() => applySlippage(1_000n, -1)).toThrow('between 0 and 10000')
    expect(() => applySlippage(1_000n, 10_001)).toThrow('between 0 and 10000')
    expect(() => applySlippage(1_000n, 1.5)).toThrow('between 0 and 10000')
  })
})
