import { describe, expect, it } from 'bun:test'
import { type Address, createPublicClient, custom, encodeFunctionResult } from 'viem'
import { base } from 'viem/chains'
import { externalAccessControlAbi } from '../src/abi/externalAccessControl.js'
import { getPendingDefaultAdmin } from '../src/actions/accessControl/defaultAdminTransfer.js'

const accessControl: Address = '0x1111111111111111111111111111111111111111'
const newAdmin: Address = '0x2222222222222222222222222222222222222222'

describe('getPendingDefaultAdmin', () => {
  it('names the tuple fields', async () => {
    const client = createPublicClient({
      chain: base,
      transport: custom({
        request: async ({ method }) => {
          if (method !== 'eth_call') throw new Error(`unexpected ${method}`)
          return encodeFunctionResult({
            abi: externalAccessControlAbi,
            functionName: 'pendingDefaultAdmin',
            result: [newAdmin, 1_760_000_000],
          })
        },
      }),
    })

    expect(await getPendingDefaultAdmin(client, { accessControl })).toEqual({
      newAdmin,
      schedule: 1_760_000_000,
    })
  })
})
