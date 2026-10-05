import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { isAddress, zeroAddress } from 'viem'
import {
  buildSpawnAccessControlCall,
  predictAccessControlDeployment,
} from '../src/actions/accessControl/spawnAccessControl.js'
import { predictMultiVehicleDeployment } from '../src/actions/multiVehicle/spawnMultiVehicle.js'
import { extractAccessControlAddress } from '../src/utils/receipt.js'
import { randomSalt } from '../src/utils/salt.js'
import { type createRailnetTestClient, testAccount } from './client.js'
import { BASE_ADDRESSES, EAC_FACTORY, MULTI_VEHICLE_FACTORY, USDC } from './constants.js'
import { setupAnvil, teardownAnvil } from './setup.js'

let client: ReturnType<typeof createRailnetTestClient>

beforeAll(async () => {
  client = (await setupAnvil()).client
  await client.setAutomine(true)
}, 30_000)

afterAll(() => teardownAnvil())

describe('deployment prediction', () => {
  it('predicts the address an access control spawn lands on', async () => {
    const account = testAccount(4)
    const parameters = {
      factory: EAC_FACTORY,
      initialDefaultAdmin: account.address,
      deploymentSalt: randomSalt(),
    }

    const predicted = await predictAccessControlDeployment(client, parameters)
    const hash = await client.writeContract({
      ...buildSpawnAccessControlCall(parameters),
      account,
      chain: client.chain,
    })
    const receipt = await client.waitForTransactionReceipt({ hash })

    expect(extractAccessControlAddress(receipt, EAC_FACTORY)).toBe(predicted)
  })

  it('predicts the multi-vehicle and its five engines', async () => {
    const predicted = await predictMultiVehicleDeployment(client, {
      factory: MULTI_VEHICLE_FACTORY,
      asset: USDC,
      name: 'Predicted',
      symbol: 'PRD',
      accessControl: zeroAddress,
      queryRegistry: BASE_ADDRESSES.queryRegistry,
      salts: {
        multiVehicle: randomSalt(),
        queryRedeemQueue: randomSalt(),
        queueStrategyEngine: randomSalt(),
        sectorAccountingEngine: randomSalt(),
        subQueryEngine: randomSalt(),
        vehicleManager: randomSalt(),
        initialDepositQuery: randomSalt(),
      },
    })

    const addresses = Object.values(predicted)
    expect(addresses).toHaveLength(6)
    expect(new Set(addresses).size).toBe(6)
    expect(addresses.every((address) => isAddress(address) && address !== zeroAddress)).toBe(true)
  })
})
