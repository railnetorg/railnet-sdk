import { describe, expect, it } from 'bun:test'
import { type Address, type Chain, createPublicClient, http, zeroAddress, zeroHash } from 'viem'
import { readContract } from 'viem/actions'
import { base, mainnet } from 'viem/chains'
import { aaveV3VehicleFactoryAbi } from '../src/abi/aaveV3VehicleFactory.js'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
import { erc4626VehicleFactoryAbi } from '../src/abi/erc4626VehicleFactory.js'
import { morphoBlueVehicleFactoryAbi } from '../src/abi/morphoBlueVehicleFactory.js'
import { multiVehicleFactoryAbi } from '../src/abi/multiVehicleFactory.js'
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
  {
    label: 'production on Base',
    chain: base,
    rpcUrl: process.env.BASE_RPC_URL,
    book: productionAddresses[8453],
    usdcAuthorized: true,
  },
]

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

    it('wires the conduit factory to the asset registry it ships', async () => {
      const assetRegistry = await readContract(client, {
        address: book.conduitFactory,
        abi: conduitFactoryAbi,
        functionName: 'ASSET_REGISTRY',
      })

      expect(assetRegistry).toBe(book.assetRegistry)
    })

    it('wires every shipped factory to the other contracts of its book', async () => {
      const conduit = { address: book.conduitFactory, abi: conduitFactoryAbi } as const

      const [coreFactory, eacFactory, accountListFactory, feeManagerFactory, ownerRegistryFactory] =
        await Promise.all([
          readContract(client, { ...conduit, functionName: 'CORE_FACTORY' }),
          readContract(client, { ...conduit, functionName: 'ACCESS_CONTROL_FACTORY' }),
          readContract(client, { ...conduit, functionName: 'ACCOUNT_LIST_FACTORY' }),
          readContract(client, { ...conduit, functionName: 'FEE_MANAGER_FACTORY' }),
          readContract(client, { ...conduit, functionName: 'OWNER_REGISTRY_FACTORY' }),
        ])
      expect({
        coreFactory,
        eacFactory,
        accountListFactory,
        feeManagerFactory,
        ownerRegistryFactory,
      }).toEqual({
        coreFactory: book.coreFactory,
        eacFactory: book.eacFactory,
        accountListFactory: book.accountListFactory,
        feeManagerFactory: book.feeManagerFactory,
        ownerRegistryFactory: book.ownerRegistryFactory,
      })

      const vehicleWiring = await Promise.all([
        Promise.all([
          readContract(client, {
            address: book.multiVehicleFactory,
            abi: multiVehicleFactoryAbi,
            functionName: 'CORE_FACTORY',
          }),
          readContract(client, {
            address: book.multiVehicleFactory,
            abi: multiVehicleFactoryAbi,
            functionName: 'ASSET_REGISTRY',
          }),
          readContract(client, {
            address: book.multiVehicleFactory,
            abi: multiVehicleFactoryAbi,
            functionName: 'MODULES_MANAGER_FACTORY',
          }),
        ]),
        Promise.all([
          readContract(client, {
            address: book.aaveV3VehicleFactory,
            abi: aaveV3VehicleFactoryAbi,
            functionName: 'CORE_FACTORY',
          }),
          readContract(client, {
            address: book.aaveV3VehicleFactory,
            abi: aaveV3VehicleFactoryAbi,
            functionName: 'ASSET_REGISTRY',
          }),
          readContract(client, {
            address: book.aaveV3VehicleFactory,
            abi: aaveV3VehicleFactoryAbi,
            functionName: 'MODULES_MANAGER_FACTORY',
          }),
        ]),
        Promise.all([
          readContract(client, {
            address: book.erc4626VehicleFactory,
            abi: erc4626VehicleFactoryAbi,
            functionName: 'CORE_FACTORY',
          }),
          readContract(client, {
            address: book.erc4626VehicleFactory,
            abi: erc4626VehicleFactoryAbi,
            functionName: 'ASSET_REGISTRY',
          }),
          readContract(client, {
            address: book.erc4626VehicleFactory,
            abi: erc4626VehicleFactoryAbi,
            functionName: 'MODULES_MANAGER_FACTORY',
          }),
        ]),
        Promise.all([
          readContract(client, {
            address: book.morphoBlueVehicleFactory,
            abi: morphoBlueVehicleFactoryAbi,
            functionName: 'CORE_FACTORY',
          }),
          readContract(client, {
            address: book.morphoBlueVehicleFactory,
            abi: morphoBlueVehicleFactoryAbi,
            functionName: 'ASSET_REGISTRY',
          }),
          readContract(client, {
            address: book.morphoBlueVehicleFactory,
            abi: morphoBlueVehicleFactoryAbi,
            functionName: 'MODULES_MANAGER_FACTORY',
          }),
        ]),
      ])
      const expected: readonly Address[] = [
        book.coreFactory,
        book.assetRegistry,
        book.modulesManagerFactory,
      ]
      expect(vehicleWiring.flat()).toEqual([...expected, ...expected, ...expected, ...expected])
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
