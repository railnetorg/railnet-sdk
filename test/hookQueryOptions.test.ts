import { describe, expect, expectTypeOf, it, mock } from 'bun:test'
import * as tanstack from '@tanstack/react-query'
import { zeroAddress } from 'viem'
import * as wagmi from 'wagmi'
import { VEHICLE_STEAM_DEPOSIT } from '../src/constants/roles.js'
import { hasRoleQueryKey } from '../src/react/query/hasRole.js'

const useQuery = mock((options: object) => ({ data: undefined, options }))

// The hooks only call `usePublicClient` and `useQuery`, so they run outside a React tree.
mock.module('@tanstack/react-query', () => ({ ...tanstack, useQuery }))
mock.module('wagmi', () => ({ ...wagmi, usePublicClient: () => undefined }))

const { useHasRole } = await import('../src/react/hooks/useHasRole.js')

const parameters = {
  accessControl: zeroAddress,
  role: VEHICLE_STEAM_DEPOSIT,
  scope: zeroAddress,
  account: zeroAddress,
}

describe('queryOptions', () => {
  it('reaches useQuery, behind the read key and the hook enabled', () => {
    useHasRole({
      ...parameters,
      enabled: false,
      queryOptions: {
        throwOnError: false,
        staleTime: 30_000,
        // @ts-expect-error the read owns its key
        queryKey: ['railnet', 'other'],
      },
    })

    expect(useQuery.mock.lastCall?.[0]).toMatchObject({
      throwOnError: false,
      staleTime: 30_000,
      enabled: false,
      queryKey: hasRoleQueryKey(undefined, parameters),
    })
  })

  it('types data after select', () => {
    const { data } = useHasRole({
      ...parameters,
      queryOptions: { select: Number },
    })
    const { data: allowed } = useHasRole(parameters)

    expectTypeOf(data).toEqualTypeOf<number | undefined>()
    expectTypeOf(allowed).toEqualTypeOf<boolean | undefined>()
  })
})
