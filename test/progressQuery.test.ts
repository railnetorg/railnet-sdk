import { describe, expect, it } from 'bun:test'
import { type Address, encodeAbiParameters, keccak256, zeroHash } from 'viem'
import {
  buildProgressQueryCall,
  QueryMode,
  SECTOR_ALLOCATION,
  SECTOR_AVAILABLE,
  subQueryEngineAbi,
  toQueryId,
  toSubQuery,
  vehicleSector,
} from '../src/index.js'
import type { Query } from '../src/types.js'

const subQueryEngine: Address = '0x1111111111111111111111111111111111111111'
const vehicle: Address = '0x5EEfC1d368440B8165e6674f23c1869b07B199A7'
const account: Address = '0xd2135CfB216b74109775236E36d4b433F1DF507B'
const USDC: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const chainId = 8453

const query: Query = {
  owner: account,
  receiver: account,
  input: { asset: USDC, value: 1_000_000n },
  output: { asset: vehicle, value: 0n },
  mode: QueryMode.DEPOSIT,
  salt: zeroHash,
  data: '0x',
}

const parameters = {
  subQueryEngine,
  chainId,
  vehicle,
  query,
  settledDestination: SECTOR_ALLOCATION,
  rejectedDestination: SECTOR_AVAILABLE,
}

describe('toSubQuery', () => {
  it('derives queryId the way the vehicle does', () => {
    expect(toSubQuery(parameters).queryId).toBe(toQueryId({ chainId, vehicle, query }))
  })

  it('carries both destinations through unchanged', () => {
    const subQuery = toSubQuery(parameters)

    expect(subQuery.settledDestination).toBe(SECTOR_ALLOCATION)
    expect(subQuery.rejectedDestination).toBe(SECTOR_AVAILABLE)
    expect(subQuery.vehicle).toBe(vehicle)
  })

  /**
   * The engine keys a sub-query on keccak256(chainId, engine, subQuery), so a destination that
   * differs from the dispatch resolves to a different id and reverts UnknownSubQuery. Anything the
   * builder silently normalised would be unrecoverable on chain.
   */
  it('gives a different sub-query id for a different destination', () => {
    const subQueryIdOf = (settledDestination: `0x${string}`) =>
      keccak256(
        encodeAbiParameters(
          [
            { type: 'uint256' },
            { type: 'address' },
            {
              type: 'tuple',
              components: [
                { name: 'vehicle', type: 'address' },
                { name: 'queryId', type: 'bytes32' },
                { name: 'settledDestination', type: 'bytes32' },
                { name: 'rejectedDestination', type: 'bytes32' },
              ],
            },
          ],
          [BigInt(chainId), subQueryEngine, toSubQuery({ ...parameters, settledDestination })],
        ),
      )

    expect(subQueryIdOf(SECTOR_ALLOCATION)).not.toBe(subQueryIdOf(vehicleSector(vehicle)))
  })
})

describe('buildProgressQueryCall', () => {
  it('targets the sub-query engine with both structs', () => {
    const prepared = buildProgressQueryCall(parameters)

    expect(prepared.address).toBe(subQueryEngine)
    expect(prepared.abi).toBe(subQueryEngineAbi)
    expect(prepared.functionName).toBe('progressQuery')
    expect(prepared.args).toHaveLength(2)
    expect(prepared.args[0]).toEqual(toSubQuery(parameters))
    expect(prepared.args[1]).toBe(query)
  })
})
