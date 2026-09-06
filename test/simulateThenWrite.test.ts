import { describe, expect, it } from 'bun:test'
import { type Address, createClient, custom } from 'viem'
import { base } from 'viem/chains'
import { simulateThenWrite } from '../src/utils/simulateThenWrite.js'

const ACCOUNT = '0x000000000000000000000000000000000000beef' as Address
const CONTRACT = '0x43ea8bd0b15780ba5659086c60f72fafd1cfccd9' as Address
const TX_HASH = `0x${'ab'.repeat(32)}` as const

const abi = [
  { name: 'enable', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
] as const

function recordingClient(label: string, seen: string[], responses: Record<string, unknown>) {
  return createClient({
    chain: base,
    transport: custom({
      request: async ({ method }) => {
        seen.push(`${label}:${method}`)
        if (method in responses) return responses[method]
        throw new Error(`${label} was asked for ${method}, which it should not serve`)
      },
    }),
  })
}

describe('simulateThenWrite', () => {
  it('simulates on the app transport and signs with the wallet', async () => {
    const seen: string[] = []
    const publicClient = recordingClient('public', seen, { eth_call: '0x' })
    const walletClient = recordingClient('wallet', seen, {
      eth_sendTransaction: TX_HASH,
      eth_chainId: '0x2105',
    })

    const hash = await simulateThenWrite(
      { publicClient, walletClient },
      { address: CONTRACT, abi, functionName: 'enable', args: [] },
      ACCOUNT,
    )

    expect(hash).toBe(TX_HASH)
    expect(seen.filter((entry) => entry.endsWith('eth_call'))).toEqual(['public:eth_call'])
    expect(seen).toContain('wallet:eth_sendTransaction')
    expect(seen.some((entry) => entry.startsWith('wallet:eth_call'))).toBe(false)
  })

  it('surfaces a revert from the simulation rather than sending', async () => {
    const seen: string[] = []
    const publicClient = createClient({
      chain: base,
      transport: custom({
        request: async ({ method }) => {
          seen.push(`public:${method}`)
          throw new Error('execution reverted: not the factory')
        },
      }),
    })
    const walletClient = recordingClient('wallet', seen, { eth_sendTransaction: TX_HASH })

    const call = simulateThenWrite(
      { publicClient, walletClient },
      { address: CONTRACT, abi, functionName: 'enable', args: [] },
      ACCOUNT,
    )

    await expect(call).rejects.toThrow(/not the factory/)
    expect(seen).not.toContain('wallet:eth_sendTransaction')
  })
})
