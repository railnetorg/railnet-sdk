'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type GrantScopedRoleParameters,
  prepareGrantScopedRole,
} from '../../actions/accessControl/grantScopedRole.js'
import { simulateThenWrite } from '../simulateThenWrite.js'

export type UseGrantScopedRoleParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useGrantScopedRole({ chainId }: UseGrantScopedRoleParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, GrantScopedRoleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareGrantScopedRole(parameters),
        parameters.account,
      )
    },
  })
}
