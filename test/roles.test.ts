import { describe, expect, it } from 'bun:test'
import { type Hex, keccak256, toHex } from 'viem'
import * as roles from '../src/constants/roles.js'

const { DEFAULT_ADMIN_ROLE, ROLES, roleName, ...hashedRoles } = roles

type Role = { name: string; hash: Hex }

const registry: readonly Role[] = ROLES

// In `ROLES` but declared by the access-control base, not the role library.
const SDK_ONLY = ['DEFAULT_ADMIN_ROLE']

function parseRoles(source: string): Role[] {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  const declared = code.match(/\bconstant\b/g)?.length ?? 0
  const parsed = [...code.matchAll(/\bconstant\s+(\w+)\s*=\s*keccak256\(\s*"(\w+)"\s*\)/g)].map(
    ([, name, preimage]) => ({ name: name as string, hash: keccak256(toHex(preimage as string)) }),
  )
  // An empty source or a declaration of another shape must fail, never pass as "no difference".
  if (parsed.length === 0 || parsed.length !== declared) {
    throw new Error(`${declared - parsed.length} of ${declared} declarations not parsed`)
  }
  return parsed
}

function diffRoles(source: string, roles: readonly Role[]) {
  const declared = new Map(parseRoles(source).map((role) => [role.name, role.hash]))
  const listed = new Map(
    roles.filter((role) => !SDK_ONLY.includes(role.name)).map((role) => [role.name, role.hash]),
  )
  return {
    missing: [...declared.keys()].filter((name) => !listed.has(name)),
    extra: [...listed.keys()].filter((name) => !declared.has(name)),
    wrongHash: [...listed]
      .filter(([name, hash]) => (declared.get(name) ?? hash) !== hash)
      .map(([name]) => name),
  }
}

const declare = (name: string, preimage = name) =>
  `bytes32 internal constant ${name} = keccak256("${preimage}");`
const sourceOf = (roles: readonly Role[]) =>
  roles
    .filter((role) => !SDK_ONLY.includes(role.name))
    .map((role) => declare(role.name))
    .join('\n')
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

describe('diffRoles', () => {
  const clean = { missing: [], extra: [], wrongHash: [] }
  const [first] = ROLES
  const rest = registry.slice(1)

  it('finds no difference when every role is declared', () => {
    expect(diffRoles(sourceOf(registry), registry)).toEqual(clean)
  })

  it('ignores comments and declarations split across lines', () => {
    const source = `/// @dev the constant below\n/* constant */\n${sourceOf(registry)}\nbytes32 internal constant\n  LONG_ROLE =\n    keccak256("LONG_ROLE");`
    expect(
      diffRoles(source, [...registry, { name: 'LONG_ROLE', hash: keccak256(toHex('LONG_ROLE')) }]),
    ).toEqual(clean)
  })

  it('reports a declared role missing from ROLES', () => {
    expect(diffRoles(`${sourceOf(registry)}\n${declare('NEW_ROLE')}`, registry).missing).toEqual([
      'NEW_ROLE',
    ])
  })

  it('reports a role in ROLES that is not declared', () => {
    expect(diffRoles(sourceOf(rest), registry).extra).toEqual([first.name])
  })

  it('reports a renamed role both ways', () => {
    const diff = diffRoles(`${declare('RENAMED')}\n${sourceOf(rest)}`, registry)
    expect(diff.missing).toEqual(['RENAMED'])
    expect(diff.extra).toEqual([first.name])
  })

  it('reports a role whose hashed string differs from its name', () => {
    const source = `${declare(first.name, 'OTHER')}\n${sourceOf(rest)}`
    expect(diffRoles(source, registry).wrongHash).toEqual([first.name])
  })

  it('throws on an empty source or a declaration it cannot read', () => {
    expect(() => diffRoles('', registry)).toThrow()
    expect(() =>
      diffRoles(`${sourceOf(registry)}\nbytes32 internal constant ODD = bytes32(0);`, registry),
    ).toThrow()
  })
})

// Run at each resync, pointed at the protocol's role declarations. Skipped otherwise.
const sourceFile = process.env.PROTOCOL_ROLES_FILE

describe.skipIf(!sourceFile)('ROLES against the protocol source', () => {
  it('lists every declared role, and only those', async () => {
    expect(diffRoles(await Bun.file(sourceFile as string).text(), registry)).toEqual({
      missing: [],
      extra: [],
      wrongHash: [],
    })
  })
})
