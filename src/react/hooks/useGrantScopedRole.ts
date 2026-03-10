'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { GrantScopedRoleParameters } from '../../actions/accessControl/grantScopedRole.js'
import {
  type GrantScopedRoleReturnType,
  grantScopedRole,
} from '../../actions/accessControl/grantScopedRole.js'

export function useGrantScopedRole() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    GrantScopedRoleReturnType,
    Error,
    GrantScopedRoleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return grantScopedRole(walletClient, parameters)
    },
  })
}
