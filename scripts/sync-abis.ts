import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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
  AssetRegistry: 'assetRegistry',
  ExternalAccessControl: 'externalAccessControl',
  SectorAccountingEngine: 'sectorAccountingEngine',
  QueueStrategyEngine: 'queueStrategyEngine',
  VehicleManager: 'vehicleManager',
  Conduit: 'conduit',
  ConduitFactory: 'conduitFactory',
}

if (!existsSync(CONTRACTS_ABIS)) {
  console.error(`Error: contracts ABIs not found at ${CONTRACTS_ABIS}`)
  console.error('Usage: bun scripts/sync-abis.ts [path-to-contracts]')
  process.exit(1)
}

let updated = 0

for (const [contract, sdkName] of Object.entries(CONTRACTS)) {
  const sourceFile = resolve(CONTRACTS_ABIS, `${contract}.json`)
  const sdkFile = resolve(SDK_ABIS, `${sdkName}.ts`)

  if (!existsSync(sourceFile)) {
    console.log(`⚠️  ${contract}: no compiled ABI in contracts, skipping`)
    continue
  }

  const json = readFileSync(sourceFile, 'utf8').trimEnd()
  writeFileSync(sdkFile, `export const ${sdkName}Abi = ${json} as const\n`)

  console.log(`✅ ${contract} -> src/abi/${sdkName}.ts`)
  updated++
}

console.log(`\nUpdated ${updated} ABI files`)
