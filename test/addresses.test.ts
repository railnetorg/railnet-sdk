import { describe, expect, it } from 'bun:test'
import { createPublicClient, http } from 'viem'
import { readContract } from 'viem/actions'
import { base } from 'viem/chains'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
import { getInitialDepositAmount } from '../src/actions/assetRegistry/getInitialDepositAmount.js'
import { BASE_ADDRESSES, CONDUIT_FACTORY, TEST_CONDUIT, USDC } from './constants.js'

// Reads only, so this talks to Base directly instead of paying for an anvil fork.
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) })

describe('shipped Base addresses', () => {
  // The ABIs and the addresses are synced separately, so nothing stops them drifting
  // onto different deployment generations. `isDeployedBy` is the cheapest thing that notices: the
  // fixture is the conduit estimateConduit proves the scalar ABI can talk to, and a factory from
  // another generation disowns it.
  it('ships a conduit factory from the same generation as the ABIs', async () => {
    const isDeployedBy = await readContract(client, {
      address: CONDUIT_FACTORY,
      abi: conduitFactoryAbi,
      functionName: 'isDeployedBy',
      args: [TEST_CONDUIT],
    })

    expect(isDeployedBy).toBe(true)
  })

  it('wires the conduit factory to the asset registry it ships', async () => {
    const assetRegistry = await readContract(client, {
      address: CONDUIT_FACTORY,
      abi: conduitFactoryAbi,
      functionName: 'ASSET_REGISTRY',
    })

    expect(assetRegistry).toBe(BASE_ADDRESSES.assetRegistry)
  })

  it('ships an asset registry that authorizes USDC', async () => {
    const amount = await getInitialDepositAmount(client, {
      assetRegistry: BASE_ADDRESSES.assetRegistry,
      asset: USDC,
    })

    expect(amount).toBeGreaterThan(0n)
  })
})
