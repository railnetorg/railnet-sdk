import { describe, expect, test } from 'bun:test'
import { encodeAbiParameters, keccak256, zeroAddress, zeroHash } from 'viem'
import {
  buildDepositConduitQuery,
  conduitAbi,
  queryAbiParameter,
  toCall,
  toQueryId,
  toQuerySalt,
} from '../src/index.js'

const SENDER = '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const
const VEHICLE = '0x5EEfC1d368440B8165e6674f23c1869b07B199A7' as const
const CONDUIT = '0x36Fbc89D0d2bFCc333e0075bd73c6A4dFcBA121A' as const

/** Drops the ABI metadata `encodeAbiParameters` ignores, leaving the shape that fixes the encoding. */
function shapeOf(parameter: unknown): unknown {
  if (Array.isArray(parameter)) return parameter.map(shapeOf)
  if (parameter && typeof parameter === 'object') {
    const { type, components } = parameter as { type: string; components?: unknown }
    return components ? { type, components: shapeOf(components) } : { type }
  }
  return parameter
}

describe('query identity', () => {
  test('queryAbiParameter still matches the conduit ABI', () => {
    const create = conduitAbi.find(
      (item) => item.type === 'function' && item.name === 'create',
    ) as Extract<(typeof conduitAbi)[number], { type: 'function' }>

    expect(shapeOf(create.inputs[0])).toEqual(shapeOf(queryAbiParameter))
  })

  test('toQuerySalt derives the salt conduit.create() requires', () => {
    expect(toQuerySalt({ sender: SENDER, salt: zeroHash })).toBe(
      keccak256(
        encodeAbiParameters([{ type: 'address' }, { type: 'bytes32' }], [SENDER, zeroHash]),
      ),
    )
  })

  test('a deposit query carries the sender-bound salt, not the raw one', () => {
    const query = buildDepositConduitQuery({
      conduit: CONDUIT,
      token: zeroAddress,
      amount: 100n,
      sender: SENDER,
      vehicle: VEHICLE,
      salt: zeroHash,
    })

    expect(query.salt).toBe(toQuerySalt({ sender: SENDER, salt: zeroHash }))
    expect(query.salt).not.toBe(zeroHash)
  })

  test('the query id changes with the sender, the chain and the vehicle', () => {
    const query = buildDepositConduitQuery({
      conduit: CONDUIT,
      token: zeroAddress,
      amount: 100n,
      sender: SENDER,
      vehicle: VEHICLE,
      salt: zeroHash,
    })
    const identity = { chainId: 8453, vehicle: VEHICLE, query }

    expect(toQueryId(identity)).toBe(toQueryId(identity))
    expect(toQueryId({ ...identity, chainId: 1 })).not.toBe(toQueryId(identity))
    expect(toQueryId({ ...identity, vehicle: zeroAddress })).not.toBe(toQueryId(identity))
    expect(
      toQueryId({
        ...identity,
        query: buildDepositConduitQuery({
          conduit: CONDUIT,
          token: zeroAddress,
          amount: 100n,
          sender: zeroAddress,
          vehicle: VEHICLE,
          salt: zeroHash,
        }),
      }),
    ).not.toBe(toQueryId(identity))
  })

  test('toCall renames address to to, for sendCalls', () => {
    const call = { address: CONDUIT, abi: conduitAbi, functionName: 'asset', args: [] } as const

    expect(toCall(call)).toEqual({
      to: CONDUIT,
      abi: conduitAbi,
      functionName: 'asset',
      args: [],
    })
    expect('address' in toCall(call)).toBe(false)
  })
})
