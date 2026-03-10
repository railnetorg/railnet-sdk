'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { RevokeScopedRoleParameters } from '../../actions/accessControl/revokeScopedRole.js'
import {
  type RevokeScopedRoleReturnType,
  revokeScopedRole,
} from '../../actions/accessControl/revokeScopedRole.js'

export function useRevokeScopedRole() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    RevokeScopedRoleReturnType,
    Error,
    RevokeScopedRoleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return revokeScopedRole(walletClient, parameters)
    },
  })
}
