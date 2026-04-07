import { createTestClient, http, publicActions, walletActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { dealActions } from './deal.js'

const TEST_MNEMONIC = 'test test test test test test test test test test test junk'

export function testAccount(index = 0) {
  return mnemonicToAccount(TEST_MNEMONIC, { addressIndex: index })
}

export function createRailnetTestClient(rpcUrl: string) {
  return createTestClient({
    mode: 'anvil',
    chain: base,
    account: testAccount(),
    transport: http(rpcUrl),
    pollingInterval: 100,
    cacheTime: 0,
  })
    .extend(publicActions)
    .extend(walletActions)
    .extend(dealActions)
}
