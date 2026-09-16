import { describe, expect, it } from 'bun:test'
import { type Chain, createPublicClient, http, zeroAddress, zeroHash } from 'viem'
import { readContract } from 'viem/actions'
import { base, mainnet } from 'viem/chains'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
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
    usdcAuthorized: false,
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
