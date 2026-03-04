import { conduitAbi } from 'railnet-sdk'

describe('conduitAbi', () => {
  test('exports a valid ABI array', () => {
    expect(Array.isArray(conduitAbi)).toBe(true)
    expect(conduitAbi.length).toBeGreaterThan(0)
  })

  test('contains balanceOf function', () => {
    const balanceOf = conduitAbi.find(
      (entry) => entry.type === 'function' && entry.name === 'balanceOf',
    )
    expect(balanceOf).toBeDefined()
    expect(balanceOf!.inputs).toHaveLength(1)
    expect(balanceOf!.inputs[0]!.type).toBe('address')
    expect(balanceOf!.stateMutability).toBe('view')
  })

  test('contains all expected conduit read functions', () => {
    const functionNames = conduitAbi
      .filter((entry) => entry.type === 'function')
      .map((entry) => entry.name)

    expect(functionNames).toContain('balanceOf')
    expect(functionNames).toContain('totalSupply')
    expect(functionNames).toContain('totalAssets')
    expect(functionNames).toContain('holdings')
    expect(functionNames).toContain('asset')
    expect(functionNames).toContain('convert')
    expect(functionNames).toContain('decimals')
    expect(functionNames).toContain('name')
    expect(functionNames).toContain('symbol')
    expect(functionNames).toContain('isEnabled')
    expect(functionNames).toContain('getVehicle')
  })

  test('all entries are view or nonpayable', () => {
    for (const entry of conduitAbi) {
      if (entry.type === 'function') {
        expect(['view', 'pure', 'nonpayable']).toContain(entry.stateMutability)
      }
    }
  })
})
