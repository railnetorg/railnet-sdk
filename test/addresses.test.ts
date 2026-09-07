import { describe, expect, it } from 'bun:test'
import { createPublicClient, http } from 'viem'
import { readContract } from 'viem/actions'
import { base } from 'viem/chains'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
import { getInitialDepositAmount } from '../src/actions/assetRegistry/getInitialDepositAmount.js'
import { BASE_ADDRESSES, CONDUIT_BEACON, CONDUIT_FACTORY, USDC } from './constants.js'

// Reads only, so this talks to Base directly instead of paying for an anvil fork.
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) })

describe('shipped Base addresses', () => {
  // The ABIs and the addresses are synced separately, so nothing stops them drifting
  // onto different deployment generations. `CONDUIT_BEACON` is the cheapest thing that notices: it
  // pins the implementation every conduit this factory spawns runs, and the expected value comes
  // from the same deployment manifest as the addresses.
  it('ships a conduit factory from the same generation as the ABIs', async () => {
    const beacon = await readContract(client, {
      address: CONDUIT_FACTORY,
      abi: conduitFactoryAbi,
      functionName: 'CONDUIT_BEACON',
    })

    expect(beacon).toBe(CONDUIT_BEACON)
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
