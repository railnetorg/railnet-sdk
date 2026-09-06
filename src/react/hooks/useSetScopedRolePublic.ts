'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  prepareSetScopedRolePublic,
  type SetScopedRolePublicParameters,
} from '../../actions/accessControl/setScopedRolePublic.js'
import { simulateThenWrite } from '../../utils/simulateThenWrite.js'

export type UseSetScopedRolePublicParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useSetScopedRolePublic({ chainId }: UseSetScopedRolePublicParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, SetScopedRolePublicParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareSetScopedRolePublic(parameters),
        parameters.account,
      )
    },
  })
}
