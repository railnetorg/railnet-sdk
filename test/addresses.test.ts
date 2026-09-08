import { describe, expect, it } from 'bun:test'
import { createPublicClient, http, zeroAddress, zeroHash } from 'viem'
import { readContract } from 'viem/actions'
import { base } from 'viem/chains'
import { conduitFactoryAbi } from '../src/abi/conduitFactory.js'
import { getInitialDepositAmount } from '../src/actions/assetRegistry/getInitialDepositAmount.js'
import { predictConduitDeployment } from '../src/actions/conduit/predictConduitDeployment.js'
import { BASE_ADDRESSES, CONDUIT_FACTORY, USDC } from './constants.js'

// Reads only, so this talks to Base directly instead of paying for an anvil fork.
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) })

describe('shipped Base addresses', () => {
  // The prediction encodes the whole `SpawnParams` tuple, so a shipped ABI that has drifted from
  // the deployed factory fails to decode here.
  it('encodes a spawn the shipped factory accepts', async () => {
    const predicted = await predictConduitDeployment(client, {
      factory: CONDUIT_FACTORY,
      name: 'probe',
      symbol: 'PRB',
      vehicle: zeroAddress,
      initialExpectedSupply: 1n,
      transferEnabled: true,
      accessControl: BASE_ADDRESSES.adminEac,
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

  // Dormant until a superseded generation is deprecated on chain.
  it('does not ship a factory the protocol has deprecated', async () => {
    const deprecated = await readContract(client, {
      address: CONDUIT_FACTORY,
      abi: conduitFactoryAbi,
      functionName: 'isDeprecated',
    })

    expect(deprecated).toBe(false)
  })
})
