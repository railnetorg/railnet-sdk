import { describe, expect, it } from 'bun:test'
import {
  type Abi,
  type Address,
  bytesToBigInt,
  type Chain,
  type Client,
  createPublicClient,
  type Hex,
  hexToBytes,
  hexToNumber,
  http,
  parseAbi,
  toFunctionSelector,
  zeroAddress,
  zeroHash,
} from 'viem'
import { getCode, readContract } from 'viem/actions'
import { base, mainnet } from 'viem/chains'
import { formatAbiItem } from 'viem/utils'
import {
  aaveV3VehicleFactoryAbi,
  accessControlFactoryAbi,
  accountListAbi,
  accountListFactoryAbi,
  assetRegistryAbi,
  baseVehicleAbi,
  conduitAbi,
  conduitFactoryAbi,
  erc4626VehicleFactoryAbi,
  externalAccessControlAbi,
  feeManagerAbi,
  feeManagerFactoryAbi,
  morphoBlueVehicleAbi,
  morphoBlueVehicleFactoryAbi,
  multiVehicleFactoryAbi,
  ownerRegistryAbi,
  ownerRegistryFactoryAbi,
  queueStrategyEngineAbi,
  sectorAccountingEngineAbi,
  subQueryEngineAbi,
  vehicleManagerAbi,
  wrapperVehicleFactoryAbi,
} from '../src/abi/index.js'
import { getInitialDepositAmount } from '../src/actions/assetRegistry/getInitialDepositAmount.js'
import { predictConduitDeployment } from '../src/actions/conduit/predictConduitDeployment.js'
import type { ChainAddresses } from '../src/contracts/addresses.js'
import { addresses as productionAddresses } from '../src/contracts/addresses.js'
import { getRailnetError } from '../src/errors.js'
import { addresses as stagingAddresses } from '../src/staging/index.js'

type Book = {
  label: string
  chain: Chain
  rpcUrl: string | undefined
  book: ChainAddresses
  /** Whether the AssetRegistry has USDC registered, so a spawn against it is possible at all. */
  usdcAuthorized: boolean
}

const books: Book[] = [
  {
    label: 'staging on Base',
    chain: base,
    rpcUrl: process.env.BASE_RPC_URL,
    book: stagingAddresses[8453],
    usdcAuthorized: true,
  },
  {
    label: 'production on Ethereum',
    chain: mainnet,
    rpcUrl: process.env.MAINNET_RPC_URL,
    book: productionAddresses[1],
    usdcAuthorized: true,
  },
]

const lookupAbi = parseAbi([
  'function implementation() view returns (address)',
  'function BEACON() view returns (address)',
  'function CONDUIT_BEACON() view returns (address)',
  'function IMPLEMENTATION() view returns (address)',
])

const PUSH1 = 0x60
const PUSH32 = 0x7f

// Solc drops a selector's leading zero bytes: `0x00a125f1` is dispatched as `PUSH3 a125f1`.
function pushedSelectors(code: Hex): Set<number> {
  const bytes = hexToBytes(code)
  const selectors = new Set<number>()
  for (let i = 0; i < bytes.length; i++) {
    const opcode = bytes[i] ?? 0
    if (opcode < PUSH1 || opcode > PUSH32) continue
    const size = opcode - PUSH1 + 1
    if (size <= 4) selectors.add(Number(bytesToBigInt(bytes.subarray(i + 1, i + 1 + size))))
    i += size
  }
  return selectors
}

type Locate = (client: Client) => Promise<Address>

const at =
  (address: Address): Locate =>
  async () =>
    address

const readAddress =
  (address: Address, functionName: 'BEACON' | 'CONDUIT_BEACON' | 'IMPLEMENTATION'): Locate =>
  (client) =>
    readContract(client, { address, abi: lookupAbi, functionName })

const behind =
  (beacon: Locate): Locate =>
  async (client) =>
    readContract(client, {
      address: await beacon(client),
      abi: lookupAbi,
      functionName: 'implementation',
    })

type MultiVehicleBeacon =
  | 'multiVehicle'
  | 'queueStrategyEngine'
  | 'sectorAccountingEngine'
  | 'subQueryEngine'
  | 'vehicleManager'

const multiVehicleBeacon =
  (book: ChainAddresses, name: MultiVehicleBeacon): Locate =>
  async (client) => {
    const [
      multiVehicle,
      ,
      queueStrategyEngine,
      sectorAccountingEngine,
      subQueryEngine,
      vehicleManager,
    ] = await readContract(client, {
      address: book.multiVehicleFactory,
      abi: multiVehicleFactoryAbi,
      functionName: 'beacons',
    })
    return {
      multiVehicle,
      queueStrategyEngine,
      sectorAccountingEngine,
      subQueryEngine,
      vehicleManager,
    }[name]
  }

type Deployment = readonly [label: string, abi: Abi, locate: Locate]

function deploymentsOf(book: ChainAddresses): Deployment[] {
  const { wrapperVehicleFactory } = book
  const viaMultiVehicle = (name: MultiVehicleBeacon) => behind(multiVehicleBeacon(book, name))

  return [
    ['conduitFactoryAbi', conduitFactoryAbi, at(book.conduitFactory)],
    ['multiVehicleFactoryAbi', multiVehicleFactoryAbi, at(book.multiVehicleFactory)],
    ['aaveV3VehicleFactoryAbi', aaveV3VehicleFactoryAbi, at(book.aaveV3VehicleFactory)],
    ['erc4626VehicleFactoryAbi', erc4626VehicleFactoryAbi, at(book.erc4626VehicleFactory)],
    ['morphoBlueVehicleFactoryAbi', morphoBlueVehicleFactoryAbi, at(book.morphoBlueVehicleFactory)],
    ['accessControlFactoryAbi', accessControlFactoryAbi, at(book.eacFactory)],
    ['externalAccessControlAbi', externalAccessControlAbi, at(book.adminEac)],
    ['feeManagerFactoryAbi', feeManagerFactoryAbi, at(book.feeManagerFactory)],
    ['accountListFactoryAbi', accountListFactoryAbi, at(book.accountListFactory)],
    ['ownerRegistryFactoryAbi', ownerRegistryFactoryAbi, at(book.ownerRegistryFactory)],
    ['assetRegistryAbi', assetRegistryAbi, at(book.assetRegistry)],
    ['conduitAbi', conduitAbi, behind(readAddress(book.conduitFactory, 'CONDUIT_BEACON'))],
    [
      'baseVehicleAbi on the Aave V3 vehicle',
      baseVehicleAbi,
      behind(readAddress(book.aaveV3VehicleFactory, 'BEACON')),
    ],
    [
      'baseVehicleAbi on the ERC-4626 vehicle',
      baseVehicleAbi,
      behind(readAddress(book.erc4626VehicleFactory, 'BEACON')),
    ],
    [
      'morphoBlueVehicleAbi',
      morphoBlueVehicleAbi,
      readAddress(book.morphoBlueVehicleFactory, 'IMPLEMENTATION'),
    ],
    ['baseVehicleAbi on the multi-vehicle', baseVehicleAbi, viaMultiVehicle('multiVehicle')],
    ['queueStrategyEngineAbi', queueStrategyEngineAbi, viaMultiVehicle('queueStrategyEngine')],
    [
      'sectorAccountingEngineAbi',
      sectorAccountingEngineAbi,
      viaMultiVehicle('sectorAccountingEngine'),
    ],
    ['subQueryEngineAbi', subQueryEngineAbi, viaMultiVehicle('subQueryEngine')],
    ['vehicleManagerAbi', vehicleManagerAbi, viaMultiVehicle('vehicleManager')],
    ['feeManagerAbi', feeManagerAbi, behind(readAddress(book.feeManagerFactory, 'BEACON'))],
    ['accountListAbi', accountListAbi, behind(readAddress(book.accountListFactory, 'BEACON'))],
    [
      'ownerRegistryAbi',
      ownerRegistryAbi,
      behind(readAddress(book.ownerRegistryFactory, 'BEACON')),
    ],
    ...(wrapperVehicleFactory
      ? ([
          ['wrapperVehicleFactoryAbi', wrapperVehicleFactoryAbi, at(wrapperVehicleFactory)],
          [
            'baseVehicleAbi on the wrapper vehicle',
            baseVehicleAbi,
            readAddress(wrapperVehicleFactory, 'IMPLEMENTATION'),
          ],
        ] satisfies Deployment[])
      : []),
  ]
}

for (const { label, chain, rpcUrl, book, usdcAuthorized } of books) {
  describe(`shipped addresses — ${label}`, () => {
    const client = createPublicClient({ chain, transport: http(rpcUrl) })

    // The prediction encodes the whole `SpawnParams` tuple, so a shipped ABI that has drifted from
    // the deployed factory fails to decode here.
    it('encodes a spawn the shipped factory accepts', async () => {
      const predicted = await predictConduitDeployment(client, {
        factory: book.conduitFactory,
        name: 'probe',
        symbol: 'PRB',
        vehicle: zeroAddress,
        initialExpectedSupply: 1n,
        transferEnabled: true,
        accessControl: book.adminEac,
        feeManager: zeroAddress,
        accountList: zeroAddress,
        ownerRegistry: zeroAddress,
        querySalt: zeroHash,
        deploymentSalt: zeroHash,
      })

      expect(predicted).not.toBe(zeroAddress)
    })

    for (const [abiLabel, abi, locate] of deploymentsOf(book)) {
      it(`dispatches every function of ${abiLabel}`, async () => {
        const address = await locate(client)
        const code = await getCode(client, { address })
        const dispatched = pushedSelectors(code ?? '0x')
        const missing = abi
          .filter((item) => item.type === 'function')
          .filter((item) => !dispatched.has(hexToNumber(toFunctionSelector(item))))
          .map((item) => formatAbiItem(item))

        expect(missing).toEqual([])
      })
    }

    it('wires the conduit factory to the asset registry it ships', async () => {
      const assetRegistry = await readContract(client, {
        address: book.conduitFactory,
        abi: conduitFactoryAbi,
        functionName: 'ASSET_REGISTRY',
      })

      expect(assetRegistry).toBe(book.assetRegistry)
    })

    // Dormant until a superseded generation is deprecated on chain.
    it('does not ship a factory the protocol has deprecated', async () => {
      const deprecated = await readContract(client, {
        address: book.conduitFactory,
        abi: conduitFactoryAbi,
        functionName: 'isDeprecated',
      })

      expect(deprecated).toBe(false)
    })

    it('starts the deployment at a block the chain has reached', async () => {
      expect(book.startedAtBlock).toBeGreaterThan(0n)
      expect(await client.getBlockNumber()).toBeGreaterThan(book.startedAtBlock)
    })

    if (usdcAuthorized) {
      it('ships an asset registry that authorizes USDC', async () => {
        const amount = await getInitialDepositAmount(client, {
          assetRegistry: book.assetRegistry,
          asset: book.usdc,
        })

        expect(amount).toBeGreaterThan(0n)
      })
    } else {
      // No asset is registered on this deployment yet, so a spawn against it is not possible.
      // Registering USDC turns this red: flip `usdcAuthorized` when it happens.
      it('ships an asset registry with no asset registered yet', async () => {
        const reverted = await getInitialDepositAmount(client, {
          assetRegistry: book.assetRegistry,
          asset: book.usdc,
        }).catch(getRailnetError)

        expect(reverted).toMatchObject({ name: 'AssetNotAuthorized', args: [book.usdc] })
      })
    }
  })
}
