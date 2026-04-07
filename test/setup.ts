import { type AnvilInstance, spawnAnvil } from './anvil.js'
import { createRailnetTestClient } from './client.js'

export { testAccount } from './client.js'

let anvil: AnvilInstance
let client: ReturnType<typeof createRailnetTestClient>

export function getClient() {
  if (!client) throw new Error('Test client not initialized. Did beforeAll run?')
  return client
}

export function getAnvil() {
  if (!anvil) throw new Error('Anvil not initialized. Did beforeAll run?')
  return anvil
}

function getBaseRpcUrl(): string {
  const url = process.env.BASE_RPC_URL
  if (!url) {
    throw new Error(
      'BASE_RPC_URL environment variable is required. Set it in .env.test or export it.',
    )
  }
  return url
}

export async function setupAnvil(forkBlockNumber?: bigint | undefined) {
  anvil = await spawnAnvil({
    forkUrl: getBaseRpcUrl(),
    ...(forkBlockNumber !== undefined ? { forkBlockNumber } : {}),
  })
  client = createRailnetTestClient(anvil.rpcUrl)
  return { anvil, client }
}

export function teardownAnvil() {
  anvil?.stop()
}
