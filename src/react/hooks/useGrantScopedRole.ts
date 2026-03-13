'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type GrantScopedRoleParameters,
  grantScopedRole,
} from '../../actions/accessControl/grantScopedRole.js'

export function useGrantScopedRole() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, GrantScopedRoleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return grantScopedRole(publicClient, walletClient, parameters)
    },
  })
}
