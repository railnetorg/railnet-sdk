import { describe, expect, it } from 'bun:test'
import type { Address } from 'viem'
import {
  buildEnableConduitCall,
  buildEnableConduitTransfersCall,
  ConduitMode,
  ConduitState,
  QueryMode,
  QueryState,
} from '../src/index.js'

const conduit: Address = '0x2Ec94b8979868bF5586f8550733092a77Cd77C9E'

describe('exports deprecated for removal in 0.9.0', () => {
  it('keeps the conduit-scoped enum names pointing at the query-scoped ones', () => {
    expect(ConduitMode.DEPOSIT).toBe(QueryMode.DEPOSIT)
    expect(ConduitMode.REDEEM).toBe(QueryMode.REDEEM)
    expect(ConduitState.SETTLED).toBe(QueryState.SETTLED)
  })

  /**
   * The two build different calls, so aliasing one to the other would turn a deposit-time no-op
   * into a one-way latch on transfers.
   */
  it('keeps buildEnableConduitCall on enable(), not enableTransfers()', () => {
    expect(buildEnableConduitCall({ conduit }).functionName).toBe('enable')
    expect(buildEnableConduitTransfersCall({ conduit }).functionName).toBe('enableTransfers')
  })
})
