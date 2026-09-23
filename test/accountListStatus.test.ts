import { describe, expect, it } from 'bun:test'
import { type Address, createPublicClient, custom, encodeAbiParameters } from 'viem'
import { base } from 'viem/chains'
import { getAccountListStatus } from '../src/actions/accountList/getAccountListStatus.js'
import { AllowlistMode } from '../src/actions/accountList/types.js'

const accountList: Address = '0x1111111111111111111111111111111111111111'
const account: Address = '0x2222222222222222222222222222222222222222'

/**
 * Every predicate gets a distinct answer, so a mapping that pairs a field with the wrong call
 * fails rather than reading true for true.
 */
const ANSWERS = [true, false, true, false, true, false] as const

function stubTransport() {
  return custom({
    request: async ({ method }) => {
      if (method === 'eth_chainId') return `0x${base.id.toString(16)}`
      if (method !== 'eth_call') throw new Error(`unexpected ${method}`)

      const results = [
        ...ANSWERS.map((value) => encodeAbiParameters([{ type: 'bool' }], [value])),
        encodeAbiParameters([{ type: 'uint8' }], [AllowlistMode.STRICT]),
      ].map((returnData) => ({ success: true, returnData }))

      return encodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [
              { name: 'success', type: 'bool' },
              { name: 'returnData', type: 'bytes' },
            ],
          },
        ],
        [results],
      )
    },
  })
}

describe('getAccountListStatus', () => {
  it('maps each predicate onto its own field', async () => {
    const client = createPublicClient({ chain: base, transport: stubTransport() })

    const status = await getAccountListStatus(client, { accountList, account })

    expect(status).toEqual({
      canDeposit: true,
      canRedeem: false,
      canReceive: true,
      isAllowListed: false,
      isBlocked: true,
      isSanctioned: false,
      mode: AllowlistMode.STRICT,
    })
  })
})
