import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const CONTRACTS_DIR = process.argv[2] || resolve(scriptDir, '../../contracts')
const ROLES_SOL = resolve(CONTRACTS_DIR, 'src/libs/Roles.sol')
const ROLES_TS = resolve(scriptDir, '../src/constants/roles.ts')

if (!existsSync(ROLES_SOL)) {
  console.error(`Error: Roles.sol not found at ${ROLES_SOL}`)
  console.error('Usage: bun scripts/check-roles.ts [path-to-contracts]')
  process.exit(1)
}

function names(content: string, pattern: RegExp): Set<string> {
  return new Set([...content.matchAll(pattern)].map((match) => match[1] as string))
}

const contractRoles = names(readFileSync(ROLES_SOL, 'utf8'), /keccak256\("([A-Z0-9_]+)"\)/g)
const sdkRoles = names(readFileSync(ROLES_TS, 'utf8'), /toHex\('([A-Z0-9_]+)'\)/g)

const dead = [...sdkRoles].filter((role) => !contractRoles.has(role)).sort()
const missing = [...contractRoles].filter((role) => !sdkRoles.has(role)).sort()

if (dead.length) console.log(`❌ In the SDK but not in Roles.sol: ${dead.join(', ')}`)
if (missing.length) console.log(`⚠️  In Roles.sol but not in the SDK: ${missing.join(', ')}`)

if (!dead.length && !missing.length) {
  console.log(`✅ ${contractRoles.size} roles, exact match`)
  process.exit(0)
}

console.log(`\nSDK: ${sdkRoles.size} roles, Roles.sol: ${contractRoles.size} roles`)
process.exit(dead.length ? 1 : 0)
