'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type SetScopedRolePublicParameters,
  setScopedRolePublic,
} from '../../actions/accessControl/setScopedRolePublic.js'

export function useSetScopedRolePublic() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SetScopedRolePublicParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return setScopedRolePublic(publicClient, walletClient, parameters)
    },
  })
}
