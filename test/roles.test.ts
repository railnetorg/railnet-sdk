import { describe, expect, it } from 'bun:test'
import { keccak256, toHex } from 'viem'
import * as roles from '../src/constants/roles.js'

const { DEFAULT_ADMIN_ROLE, ...hashedRoles } = roles

describe('role constants', () => {
  it('DEFAULT_ADMIN_ROLE is bytes32 zero', () => {
    expect(DEFAULT_ADMIN_ROLE).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    )
  })

  it('each role is the keccak256 of its own name', () => {
    expect(Object.keys(hashedRoles).length).toBeGreaterThan(0)

    for (const [name, role] of Object.entries(hashedRoles)) {
      expect(role).toBe(keccak256(toHex(name)))
    }
  })
})
