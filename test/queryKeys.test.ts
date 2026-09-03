import { describe, expect, it } from 'bun:test'
import { hashKey } from '@tanstack/react-query'
import type { Address } from 'viem'
import { base } from 'viem/chains'
import { EstimationType } from '../src/actions/conduit/estimateConduit.js'
import { ConduitMode } from '../src/actions/conduit/types.js'
import {
  conduitPositionQueryKey,
  conduitPositionQueryPrefix,
  estimateConduitQueryKey,
  predictConduitDeploymentQueryKey,
} from '../src/react/query/index.js'

const CONDUIT = '0x43ea8bd0b15780ba5659086c60f72fafd1cfccd9' as Address
const ACCOUNT = '0x000000000000000000000000000000000000beef' as Address
const ASSET = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address

describe('query keys', () => {
  it('hashes a key holding a bigint instead of throwing', () => {
    const key = estimateConduitQueryKey(base.id, {
      conduit: CONDUIT,
      asset: { asset: ASSET, value: 100_000_000n },
      mode: ConduitMode.DEPOSIT,
      estimationType: EstimationType.OUTPUT,
    })

    expect(() => hashKey(key)).not.toThrow()
  })

  it('hashes a key holding a nested bigint instead of throwing', () => {
    const key = predictConduitDeploymentQueryKey(base.id, {
      factory: CONDUIT,
      name: 'Test',
      symbol: 'TEST',
      vehicle: ASSET,
      initialExpectedSupply: 2_000_000n,
      transferEnabled: true,
      accessControl: ACCOUNT,
      feeManager: ACCOUNT,
      accountList: ACCOUNT,
      ownerRegistry: ACCOUNT,
      querySalt: `0x${'11'.repeat(32)}`,
      deploymentSalt: `0x${'22'.repeat(32)}`,
    })

    expect(() => hashKey(key)).not.toThrow()
  })

  it('gives one entry to an address whatever its casing', () => {
    const lower = conduitPositionQueryKey(base.id, { conduit: CONDUIT, account: ACCOUNT })
    const upper = conduitPositionQueryKey(base.id, {
      conduit: CONDUIT.toUpperCase().replace('0X', '0x') as Address,
      account: ACCOUNT.toUpperCase().replace('0X', '0x') as Address,
    })

    expect(hashKey(upper)).toBe(hashKey(lower))
  })

  it('separates the same conduit on two chains', () => {
    const onBase = conduitPositionQueryKey(base.id, { conduit: CONDUIT, account: ACCOUNT })
    const onMainnet = conduitPositionQueryKey(1, { conduit: CONDUIT, account: ACCOUNT })

    expect(hashKey(onMainnet)).not.toBe(hashKey(onBase))
  })

  it('is reachable by its prefix, so a caller can invalidate every chain at once', () => {
    const key = conduitPositionQueryKey(base.id, { conduit: CONDUIT, account: ACCOUNT })

    expect(key.slice(0, conduitPositionQueryPrefix.length)).toEqual([...conduitPositionQueryPrefix])
  })
})
