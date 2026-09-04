import { describe, expect, it } from 'bun:test'
import { type Address, createClient, http } from 'viem'
import { base, mainnet } from 'viem/chains'
import { deployMultiVehicle } from '../src/workflows/deployMultiVehicle.js'

const ACCOUNT = '0x000000000000000000000000000000000000beef' as Address

const parameters = {
  asset: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
  name: 'Test',
  symbol: 'TEST',
  vehicles: [],
  salts: {} as never,
  account: ACCOUNT,
}

describe('deployMultiVehicle', () => {
  it('refuses a chain that is not the client chain, before reaching the network', async () => {
    const client = createClient({ chain: base, transport: http('http://127.0.0.1:1') })

    await expect(deployMultiVehicle(client, parameters, { chain: mainnet })).rejects.toThrow(
      /does not match the client chain/,
    )
  })
})
