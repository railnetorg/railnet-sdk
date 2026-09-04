import { describe, expect, it } from 'bun:test'
import { attachQueryKey } from '../src/react/query/attachQueryKey.js'

describe('attachQueryKey', () => {
  it('carries the key without reading the fields the result tracks', () => {
    const read: string[] = []
    const result = {
      get data() {
        read.push('data')
        return 'value'
      },
      get isFetching() {
        read.push('isFetching')
        return false
      },
    }

    const withKey = attachQueryKey(result, ['railnet', 'conduitInfo'] as const)

    expect(result).toBe(withKey)
    expect(withKey.queryKey).toEqual(['railnet', 'conduitInfo'])
    expect(read).toEqual([])
  })
})
