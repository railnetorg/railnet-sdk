'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type SetScopedRolePublicParameters,
  setScopedRolePublic,
} from '../../actions/accessControl/setScopedRolePublic.js'

export function useSetScopedRolePublic() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SetScopedRolePublicParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return setScopedRolePublic(walletClient, parameters)
    },
  })
}
