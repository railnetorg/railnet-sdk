import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const CONTRACTS_DIR = process.argv[2] || resolve(scriptDir, '../../contracts')
const CONTRACTS_ABIS = resolve(CONTRACTS_DIR, 'tools/indexing/abis')
const SDK_ABIS = resolve(scriptDir, '../src/abi')

const CONTRACTS: Record<string, string> = {
  MultiVehicleFactory: 'multiVehicleFactory',
  AaveV3VehicleFactory: 'aaveV3VehicleFactory',
  AccessControlFactory: 'accessControlFactory',
  ExternalAccessControl: 'externalAccessControl',
  SectorAccountingEngine: 'sectorAccountingEngine',
  QueueStrategyEngine: 'queueStrategyEngine',
  VehicleRegistry: 'vehicleRegistry',
  Conduit: 'conduit',
  ConduitFactory: 'conduitFactory',
}

if (!existsSync(CONTRACTS_ABIS)) {
  console.error(`Error: contracts ABIs not found at ${CONTRACTS_ABIS}`)
  console.error(`Usage: bun scripts/check-abis.ts [path-to-contracts]`)
  process.exit(1)
}

type AbiEntry = { type?: string; name?: string }

function parseSDKAbi(tsContent: string): AbiEntry[] | null {
  const match = tsContent.match(/=\s*(\[[\s\S]*\])\s*as\s+const/)
  if (!match?.[1]) return null
  const cleaned = match[1]
    .replace(/(\s)(\w+):/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(cleaned)
}

let pass = 0
let fail = 0
let missing = 0

for (const [contract, sdkName] of Object.entries(CONTRACTS)) {
  const sourceFile = resolve(CONTRACTS_ABIS, `${contract}.json`)
  const sdkFile = resolve(SDK_ABIS, `${sdkName}.ts`)

  if (!existsSync(sourceFile)) {
    console.log(`⚠️  ${contract}: no compiled ABI in contracts`)
    missing++
    continue
  }

  if (!existsSync(sdkFile)) {
    console.log(`⚠️  ${contract}: no SDK file`)
    missing++
    continue
  }

  const source: AbiEntry[] = JSON.parse(readFileSync(sourceFile, 'utf8'))
  const sdk = parseSDKAbi(readFileSync(sdkFile, 'utf8'))

  if (!sdk) {
    console.log(`❌ ${contract}: failed to parse SDK TS file`)
    fail++
    continue
  }

  if (JSON.stringify(source) === JSON.stringify(sdk)) {
    console.log(`✅ ${contract}: ${source.length} entries, exact match`)
    pass++
  } else {
    const sig = (i: AbiEntry) => `${i.type}:${i.name || ''}`
    const srcSigs = source.map(sig)
    const sdkSigs = sdk.map(sig)
    const sdkSet = new Set(sdkSigs)
    const srcSet = new Set(srcSigs)
    const missingInSDK = srcSigs.filter((s) => !sdkSet.has(s))
    const extraInSDK = sdkSigs.filter((s) => !srcSet.has(s))
    console.log(`❌ ${contract}: MISMATCH (contracts=${source.length}, sdk=${sdk.length})`)
    if (missingInSDK.length) console.log(`   Missing in SDK: ${missingInSDK.join(', ')}`)
    if (extraInSDK.length) console.log(`   Extra in SDK: ${extraInSDK.join(', ')}`)
    fail++
  }
}

console.log(`\nResults: ${pass} passed, ${fail} failed, ${missing} missing`)

if (fail > 0) {
  console.log("Run 'bun scripts/sync-abis.ts' to update")
  process.exit(1)
}
