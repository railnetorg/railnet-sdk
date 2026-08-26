import { describe, expect, it } from 'bun:test'
import { type Hex, keccak256, toHex } from 'viem'
import * as roles from '../src/constants/roles.js'

const { DEFAULT_ADMIN_ROLE, ROLES, roleName, ...hashedRoles } = roles

const registry: readonly { name: string; hash: Hex }[] = ROLES
const exportedRoles = Object.entries(roles).filter(([, value]) => typeof value === 'string') as [
  string,
  Hex,
][]

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

describe('ROLES', () => {
  it('lists every exported role constant', () => {
    expect(registry.length).toBe(exportedRoles.length)
    for (const [name, hash] of exportedRoles) {
      expect(registry).toContainEqual({ name, hash })
    }
  })

  it('gives every entry the hash its name exports', () => {
    const exportedByName = new Map(exportedRoles)

    for (const role of registry) {
      expect(exportedByName.get(role.name)).toBe(role.hash)
    }
  })
})

describe('roleName', () => {
  it('resolves every role in the registry', () => {
    for (const role of registry) {
      expect(roleName(role.hash)).toBe(role.name)
    }
  })

  it('returns null for a hash that is not a role', () => {
    expect(roleName(keccak256(toHex('NOT_A_ROLE')))).toBeNull()
    expect(roleName('0xdead')).toBeNull()
  })
})
